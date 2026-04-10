import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { generateBusinessPlan } from "@/lib/ai/provider";
import { getCachedValue, setCachedValue } from "@/lib/cache/redis";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getMarketDemandIndicator } from "@/lib/market-demand";
import { serializePlan } from "@/lib/plan-formatter";
import { GROWTH_MONTHLY_PLAN_LIMIT, STARTER_PLAN_LIMIT, getTierLabel } from "@/lib/pricing";
import { rateLimit } from "@/lib/rate-limit";
import { plannerSchema } from "@/lib/validation/plan";
import { PlanModel } from "@/models/Plan";
import { UserModel } from "@/models/User";

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
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
  const userRecord = await UserModel.findById(auth.user.userId).select("planTier").lean();
  const planTier = userRecord?.planTier ?? "free";

  if (planTier === "free") {
    const totalPlanCount = await PlanModel.countDocuments({ userId: auth.user.userId });
    if (totalPlanCount >= STARTER_PLAN_LIMIT) {
      return NextResponse.json(
        {
          message: `Your ${getTierLabel(planTier)} plan includes up to ${STARTER_PLAN_LIMIT} plans. Upgrade to Growth at Rs 99/month for up to ${GROWTH_MONTHLY_PLAN_LIMIT} plans each month, or Pro at Rs 299/month for unlimited plans plus advanced analysis.`
        },
        { status: 403 }
      );
    }
  }

  if (planTier === "student") {
    const monthPlanCount = await PlanModel.countDocuments({
      userId: auth.user.userId,
      createdAt: { $gte: getCurrentMonthStart() }
    });

    if (monthPlanCount >= GROWTH_MONTHLY_PLAN_LIMIT) {
      return NextResponse.json(
        {
          message: `Your ${getTierLabel(planTier)} plan allows up to ${GROWTH_MONTHLY_PLAN_LIMIT} plans per month. Upgrade to Pro at Rs 299/month for unlimited plans plus advanced analysis.`
        },
        { status: 403 }
      );
    }
  }

  const plan = await PlanModel.create({
    userId: auth.user.userId,
    inputs: payload.data,
    ...generated,
    marketDemand,
    chatHistory: []
  });

  return NextResponse.json({ plan: serializePlan(plan.toObject()) }, { status: 201 });
}
