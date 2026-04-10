import Link from "next/link";
import { connectToDatabase } from "@/lib/db/mongoose";
import { EmptyState } from "@/components/shared/empty-state";
import { PlannerForm } from "@/components/forms/planner-form";
import { PlansList } from "@/components/dashboard/plans-list";
import { PlanModel } from "@/models/Plan";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";
import { GROWTH_MONTHLY_PLAN_LIMIT, STARTER_PLAN_LIMIT, getTierLabel, pricingPlans } from "@/lib/pricing";
import { UserModel } from "@/models/User";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();
  await connectToDatabase();
  const userRecord = user ? await UserModel.findById(user.userId).select("planTier").lean() : null;
  const activeTier = userRecord?.planTier ?? "free";

  const plans = await PlanModel.find({ userId: user?.userId })
    .sort({ createdAt: -1 })
    .select("businessIdea summary marketDemand createdAt roadmap")
    .lean();

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthPlanCount = plans.filter((plan) => plan.createdAt && new Date(plan.createdAt) >= monthStart).length;

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
  const starterPlansRemaining = Math.max(STARTER_PLAN_LIMIT - totalPlans, 0);
  const growthPlansRemaining = Math.max(GROWTH_MONTHLY_PLAN_LIMIT - monthPlanCount, 0);

  return (
    <div className="space-y-8">
      <section id="overview" className="glass-card scroll-mt-24 p-7">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-primary">Personalized planner</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#e6bf99]">Turn your resources into a launch-ready business.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/62">
          Fill in your skills, interests, budget, and time. The Idea2empire AI engine will generate a structured business plan and store it in your dashboard with progress tracking.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[26px] border border-white/8 bg-[rgba(255,255,255,0.02)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Current tier</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#dcb08a]">{getTierLabel(activeTier)}</h2>
            <p className="mt-2 text-sm leading-7 text-foreground/60">
              {activeTier === "free"
                ? `${starterPlansRemaining} of ${STARTER_PLAN_LIMIT} Starter plans remaining.`
                : activeTier === "student"
                  ? `${growthPlansRemaining} of ${GROWTH_MONTHLY_PLAN_LIMIT} Growth plans remaining this month.`
                  : "Unlimited plan generation with advanced analysis positioning is active for this workspace."}
            </p>
          </div>
          <div className="rounded-[26px] border border-primary/20 bg-primary/10 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Upgrade path</p>
            <p className="mt-3 text-sm leading-7 text-foreground/72">
              Growth at Rs 99/month gives users up to {GROWTH_MONTHLY_PLAN_LIMIT} plans per month. Pro at Rs 299/month unlocks unlimited plans plus advanced analysis.
            </p>
          </div>
        </div>
      </section>

      <section id="create-plan" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#d3a57c]">Create plan</p>
          <h2 className="mt-2 text-2xl font-semibold">Start a new AI business plan</h2>
        </div>
        <PlannerForm />
      </section>

      <section id="progress" className="scroll-mt-24 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Progress</p>
          <h2 className="mt-2 text-2xl font-semibold">Track how your plans are moving forward</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/58">Total plans</p>
            <p className="mt-3 text-3xl font-semibold text-[#ddb18d]">{totalPlans}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/58">In progress</p>
            <p className="mt-3 text-3xl font-semibold text-[#ddb18d]">{plansInProgress}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/58">Completed</p>
            <p className="mt-3 text-3xl font-semibold text-[#ddb18d]">{completedPlans}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground/58">Average progress</p>
            <p className="mt-3 text-3xl font-semibold text-[#ddb18d]">{averageProgress}%</p>
          </div>
        </div>

        {latestPlan ? (
          <div className="glass-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Latest plan</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#ddb18d]">{latestPlan.businessIdea}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/62">{latestPlan.summary}</p>
              </div>
              <Link href={`/dashboard/plans/${latestPlan._id}#tracker`} className="btn-secondary rounded-full">
                Open progress tracker
              </Link>
            </div>
            <div className="mt-6 h-3 w-full rounded-full bg-muted">
              <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${latestPlan.progressPercent}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground/58">
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
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#d3a57c]">Saved plans</p>
          <h2 className="mt-2 text-2xl font-semibold">Your previous business plans</h2>
        </div>
        {planItems.length > 0 ? (
          <PlansList plans={planItems} />
        ) : (
          <EmptyState title="No plans yet" description="Generate your first plan above to see it here." />
        )}
      </section>

      <section id="pricing" className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Monetization</p>
          <h2 className="mt-2 text-2xl font-semibold">The offer users are meant to upgrade into</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div key={plan.tier} className="glass-card p-5">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">{plan.name}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-semibold text-[#ddb18d]">{plan.priceLabel}</span>
                <span className="pb-1 text-sm text-foreground/50">{plan.cadence}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-foreground/62">{plan.highlight}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
