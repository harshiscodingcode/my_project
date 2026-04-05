import Link from "next/link";

export function PlanPreviewCard({
  planId,
  businessIdea,
  summary
}: {
  planId: string;
  businessIdea: string;
  summary: string;
}) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary">Latest output</p>
      <h3 className="mt-4 text-2xl font-semibold">{businessIdea}</h3>
      <p className="mt-4 text-sm leading-7 text-foreground/75">{summary}</p>
      <Link href={`/dashboard/plans/${planId}`} className="btn-primary mt-6">
        View complete plan
      </Link>
    </div>
  );
}
