"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plannerSchema } from "@/lib/validation/plan";
import type { PlannerFormInput } from "@/types";
import type { z } from "zod";

const PlanPreviewCard = dynamic(() => import("@/components/dashboard/plan-preview-card").then((mod) => mod.PlanPreviewCard), {
  loading: () => <div className="glass-card h-64 animate-pulse p-6" />
});

type PlannerValues = z.infer<typeof plannerSchema>;

export function PlannerForm() {
  const [result, setResult] = useState<{ planId: string; businessIdea: string; summary: string } | null>(null);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<PlannerValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      budget: 5000,
      timeAvailability: "10 hours per week"
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setResult(null);

    const response = await fetch("/api/plans/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values satisfies PlannerFormInput)
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Could not generate a plan");
      return;
    }

    setResult({
      planId: data.plan._id,
      businessIdea: data.plan.businessIdea,
      summary: data.plan.summary
    });
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={onSubmit} className="glass-card space-y-5 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Skills</label>
          <textarea className="input-base min-h-28" {...register("skills")} placeholder="Examples: sales, graphic design, coding, teaching, marketing" />
          <p className="mt-2 text-xs text-danger">{String(formState.errors.skills?.message ?? "")}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Interests</label>
          <textarea className="input-base min-h-28" {...register("interests")} placeholder="Examples: AI tools, food business, freelancing, ecommerce, local services" />
          <p className="mt-2 text-xs text-danger">{String(formState.errors.interests?.message ?? "")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Budget (INR)</label>
            <input className="input-base" type="number" min="0" step="500" {...register("budget", { valueAsNumber: true })} placeholder="5000" />
            <p className="mt-2 text-xs text-danger">{String(formState.errors.budget?.message ?? "")}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Time availability</label>
            <input className="input-base" {...register("timeAvailability")} placeholder="Example: 8 hours per week" />
            <p className="mt-2 text-xs text-danger">{String(formState.errors.timeAvailability?.message ?? "")}</p>
          </div>
        </div>
        {error && <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Generating your plan..." : "Generate AI business plan"}
        </button>
      </form>

      {result ? (
        <PlanPreviewCard {...result} />
      ) : (
        <div className="glass-card flex flex-col justify-between p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Plan engine</p>
            <h3 className="mt-4 text-2xl font-semibold">Fast AI generation with persistent execution tracking.</h3>
            <p className="mt-4 text-sm text-foreground/70">
              Each plan includes a 30-day roadmap, cost model, revenue forecast, risk analysis, market demand score, and an AI follow-up assistant.
            </p>
          </div>
          <div className="mt-6 rounded-3xl bg-muted p-5 text-sm text-foreground/80">
            Share whatever you already know. Even short answers work, and the planner will shape them into a practical starting point.
          </div>
        </div>
      )}

      {result && (
        <div className="xl:col-span-2">
          <Link href={`/dashboard/plans/${result.planId}`} className="btn-secondary">
            Open full plan
          </Link>
        </div>
      )}
    </div>
  );
}
