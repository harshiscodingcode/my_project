import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createPlanPdf } from "@/lib/pdf";
import { PlanModel } from "@/models/Plan";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return auth.error;

  const { id } = await params;
  await connectToDatabase();
  const plan = await PlanModel.findOne({ _id: id, userId: auth.user.userId }).lean();
  if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const pdf = await createPlanPdf(plan);

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${plan.businessIdea.replace(/\s+/g, "-").toLowerCase()}.pdf"`
    }
  });
}
