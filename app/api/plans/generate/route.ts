import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { generateBusinessPlan } from "@/lib/ai/provider";
import { getCachedValue, setCachedValue } from "@/lib/cache/redis";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getMarketDemandIndicator } from "@/lib/market-demand";
import { serializePlan } from "@/lib/plan-formatter";
import { rateLimit } from "@/lib/rate-limit";
import { plannerSchema } from "@/lib/validation/plan";
import { PlanModel } from "@/models/Plan";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  const allowed = await rateLimit(`generate:${auth.user.userId}`, 12, 60);
  if (!allowed) return NextResponse.json({ message: "Plan generation rate limit exceeded" }, { status: 429 });

  const payload = plannerSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const marketDemand = getMarketDemandIndicator(payload.data);
  const cacheKey = `plan:${auth.user.userId}:${Buffer.from(JSON.stringify(payload.data)).toString("base64")}`;

  let generated = await getCachedValue<any>(cacheKey);
  if (!generated) {
    generated = await generateBusinessPlan(payload.data, marketDemand);
    await setCachedValue(cacheKey, generated, 60 * 20);
  }

  await connectToDatabase();
  const plan = await PlanModel.create({
    userId: auth.user.userId,
    inputs: payload.data,
    ...generated,
    marketDemand,
    chatHistory: []
  });

  return NextResponse.json({ plan: serializePlan(plan.toObject()) }, { status: 201 });
}
