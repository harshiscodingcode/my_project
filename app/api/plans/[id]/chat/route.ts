import { NextRequest, NextResponse } from "next/server";
import { continueBusinessChat } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";
import { buildPlanContext } from "@/lib/plan-formatter";
import { rateLimit } from "@/lib/rate-limit";
import { chatSchema } from "@/lib/validation/plan";
import { PlanModel } from "@/models/Plan";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (auth.error || !auth.user) return auth.error;

  const allowed = await rateLimit(`chat:${auth.user.userId}`, 25, 60);
  if (!allowed) return NextResponse.json({ message: "Too many chat requests" }, { status: 429 });

  const payload = chatSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Invalid message" }, { status: 400 });
  }

  const { id } = await params;
  await connectToDatabase();
  const plan = await PlanModel.findOne({ _id: id, userId: auth.user.userId });
  if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const currentMessage = payload.data.message;
  plan.chatHistory.push({ role: "user", content: currentMessage, createdAt: new Date() });

  const answer = await continueBusinessChat({
    planSummary: buildPlanContext(plan),
    history: plan.chatHistory.map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.content ?? "",
      createdAt: new Date(item.createdAt).toISOString()
    })),
    message: currentMessage
  });

  plan.chatHistory.push({ role: "assistant", content: answer, createdAt: new Date() });
  await plan.save();

  return NextResponse.json({
    chatHistory: plan.chatHistory.map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.content ?? "",
      createdAt: new Date(item.createdAt).toISOString()
    }))
  });
}
