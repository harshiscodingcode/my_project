"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Step = {
  _id: string;
  day: number;
  title: string;
  description: string;
  done: boolean;
};

export function ProgressTracker({ planId, roadmap }: { planId: string; roadmap: Step[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const completeCount = roadmap.filter((step) => step.done).length;
  const progress = Math.round((completeCount / Math.max(roadmap.length, 1)) * 100);

  const toggle = (stepId: string, done: boolean) => {
    startTransition(async () => {
      await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, done })
      });
      router.refresh();
    });
  };

  return (
    <section id="tracker" className="glass-card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Progress tracker</p>
          <h3 className="mt-2 text-2xl font-semibold">{progress}% complete</h3>
        </div>
        <div className="h-3 w-full rounded-full bg-muted md:max-w-xs">
          <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {roadmap.map((step) => (
          <label key={step._id} className="flex items-start gap-3 rounded-2xl border border-border/70 p-4">
            <input type="checkbox" checked={step.done} disabled={isPending} onChange={(event) => toggle(step._id, event.target.checked)} />
            <div>
              <p className="font-medium">Day {step.day}: {step.title}</p>
              <p className="mt-1 text-sm text-foreground/70">{step.description}</p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
