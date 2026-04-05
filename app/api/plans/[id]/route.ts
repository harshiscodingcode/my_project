import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";
import { serializePlan } from "@/lib/plan-formatter";
import { taskToggleSchema } from "@/lib/validation/plan";
import { PlanModel } from "@/models/Plan";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  const { id } = await params;
  await connectToDatabase();
  const plan = await PlanModel.findOne({ _id: id, userId: auth.user.userId }).lean();
  if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  return NextResponse.json({ plan: serializePlan(plan) });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  const { id } = await params;
  await connectToDatabase();
  await PlanModel.deleteOne({ _id: id, userId: auth.user.userId });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  const payload = taskToggleSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { id } = await params;
  await connectToDatabase();
  const plan = await PlanModel.findOne({ _id: id, userId: auth.user.userId });
  if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const step = plan.roadmap.id(payload.data.stepId);
  if (!step) return NextResponse.json({ message: "Step not found" }, { status: 404 });

  step.done = payload.data.done;
  await plan.save();
  return NextResponse.json({ plan: serializePlan(plan.toObject()) });
}
