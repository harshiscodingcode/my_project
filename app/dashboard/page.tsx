import Link from "next/link";
import { connectToDatabase } from "@/lib/db/mongoose";
import { EmptyState } from "@/components/shared/empty-state";
import { PlannerForm } from "@/components/forms/planner-form";
import { PlansList } from "@/components/dashboard/plans-list";
import { PlanModel } from "@/models/Plan";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();
  await connectToDatabase();

  const plans = await PlanModel.find({ userId: user?.userId })
    .sort({ createdAt: -1 })
    .select("businessIdea summary marketDemand createdAt roadmap")
    .lean();

  const planItems = plans.map((plan) => {
    const roadmap = Array.isArray(plan.roadmap) ? plan.roadmap : [];
    const totalSteps = roadmap.length;
    const completedSteps = roadmap.filter((step) => step.done).length;

    return {
      _id: String(plan._id),
      businessIdea: plan.businessIdea ?? "Untitled plan",
      summary: plan.summary ?? "",
      marketDemand: {
        score: plan.marketDemand?.score ?? 0,
        label: plan.marketDemand?.label ?? "Low"
      },
      createdAt: plan.createdAt ? new Date(plan.createdAt).toISOString() : new Date().toISOString(),
      completedSteps,
      totalSteps,
      progressPercent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    };
  });

  const totalPlans = planItems.length;
  const plansInProgress = planItems.filter((plan) => plan.totalSteps > 0 && plan.completedSteps < plan.totalSteps).length;
  const completedPlans = planItems.filter((plan) => plan.totalSteps > 0 && plan.completedSteps === plan.totalSteps).length;
  const averageProgress = totalPlans > 0 ? Math.round(planItems.reduce((sum, plan) => sum + plan.progressPercent, 0) / totalPlans) : 0;
  const latestPlan = planItems[0] ?? null;

  return (
    <div className="space-y-8">
      <section id="overview" className="glass-card scroll-mt-24 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Personalized planner</p>
        <h1 className="mt-3 text-3xl font-semibold">Turn your current resources into a launch-ready business.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/72">
          Fill in your skills, interests, budget, and time. The AI engine will generate a structured business plan and store it in your dashboard with progress tracking.
        </p>
      </section>

      <section id="create-plan" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">Create plan</p>
          <h2 className="mt-2 text-2xl font-semibold">Start a new AI business plan</h2>
        </div>
        <PlannerForm />
      </section>

      <section id="progress" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Progress</p>
          <h2 className="mt-2 text-2xl font-semibold">Track how your plans are moving forward</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/70">Total plans</p>
            <p className="mt-3 text-3xl font-semibold">{totalPlans}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/70">In progress</p>
            <p className="mt-3 text-3xl font-semibold">{plansInProgress}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/70">Completed</p>
            <p className="mt-3 text-3xl font-semibold">{completedPlans}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/70">Average progress</p>
            <p className="mt-3 text-3xl font-semibold">{averageProgress}%</p>
          </div>
        </div>

        {latestPlan ? (
          <div className="glass-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Latest plan</p>
                <h3 className="mt-2 text-2xl font-semibold">{latestPlan.businessIdea}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/72">{latestPlan.summary}</p>
              </div>
              <Link href={`/dashboard/plans/${latestPlan._id}#tracker`} className="btn-secondary">
                Open progress tracker
              </Link>
            </div>
            <div className="mt-6 h-3 w-full rounded-full bg-muted">
              <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${latestPlan.progressPercent}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/70">
              <span>{latestPlan.completedSteps}/{latestPlan.totalSteps} steps complete</span>
              <span>{latestPlan.progressPercent}% progress</span>
            </div>
          </div>
        ) : (
          <EmptyState title="No progress yet" description="Create your first plan above, then come back here to track execution progress." />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">Saved plans</p>
          <h2 className="mt-2 text-2xl font-semibold">Your previous business plans</h2>
        </div>
        {planItems.length > 0 ? (
          <PlansList plans={planItems} />
        ) : (
          <EmptyState title="No plans yet" description="Generate your first plan above to see it here." />
        )}
      </section>
    </div>
  );
}