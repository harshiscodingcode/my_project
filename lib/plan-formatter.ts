import type { PlanDocument } from "@/models/Plan";

export function serializePlan(plan: Partial<PlanDocument> & { _id: string | { toString(): string } }) {
  return {
    ...plan,
    _id: plan._id.toString(),
    userId: "userId" in plan && plan.userId ? String(plan.userId) : undefined,
    createdAt: plan.createdAt ? new Date(plan.createdAt).toISOString() : undefined,
    updatedAt: plan.updatedAt ? new Date(plan.updatedAt).toISOString() : undefined,
    roadmap: plan.roadmap?.map((step) => ({
      ...step,
      _id: String((step as { _id?: { toString(): string } })._id ?? "")
    })),
    chatHistory: plan.chatHistory?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt).toISOString()
    }))
  };
}

export function buildPlanContext(plan: {
  businessIdea: string;
  summary: string;
  requiredTools: string[];
  riskAnalysis: string[];
}) {
  return [
    `Business idea: ${plan.businessIdea}`,
    `Summary: ${plan.summary}`,
    `Required tools: ${plan.requiredTools.join(", ")}`,
    `Risks: ${plan.riskAnalysis.join("; ")}`
  ].join("\n");
}
