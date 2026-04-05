import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";
import { serializePlan } from "@/lib/plan-formatter";
import { PlanModel } from "@/models/Plan";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  await connectToDatabase();
  const plans = await PlanModel.find({ userId: auth.user.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ plans: plans.map((plan) => serializePlan(plan)) });
}
