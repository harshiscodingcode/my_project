"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type PlanListItem = {
  _id: string;
  businessIdea: string;
  summary: string;
  marketDemand: { score: number; label: string };
  createdAt: string;
};

export function PlansList({ plans }: { plans: PlanListItem[] }) {
  const router = useRouter();

  async function deletePlan(id: string) {
    const response = await fetch(`/api/plans/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div key={plan._id} className="glass-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{plan.businessIdea}</h3>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">{plan.summary}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-foreground/60">
              <span>{formatDate(plan.createdAt)}</span>
              <span>Demand: {plan.marketDemand.label}</span>
              <span>Score: {plan.marketDemand.score}/100</span>
            </div>
          </div>
          <div className="flex gap-3">
            <a href={`/dashboard/plans/${plan._id}`} className="btn-secondary">View</a>
            <button type="button" className="btn-secondary text-danger" onClick={() => deletePlan(plan._id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
