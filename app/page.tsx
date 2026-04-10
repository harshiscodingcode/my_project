import Link from "next/link";
import { ArrowRight, Brain, Gauge, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { GROWTH_MONTHLY_PLAN_LIMIT, STARTER_PLAN_LIMIT, pricingPlans } from "@/lib/pricing";

const features = [
  {
    icon: Brain,
    title: "AI-first plan generation",
    description: "Turn your skills, interests, budget, and time into a structured 30-day launch blueprint."
  },
  {
    icon: Gauge,
    title: "Built for conversion",
    description: "Start users on Starter, move them into Growth, and keep Pro reserved for advanced analysis buyers."
  },
  {
    icon: ShieldCheck,
    title: "Retention-friendly workflow",
    description: "Keep founders engaged with saved plans, execution tracking, exports, and AI follow-up coaching."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              Turn your planner into a product people can try, trust, and upgrade.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72">
              AI Business Planner helps founders and side hustlers generate realistic business ideas, execution roadmaps, cost forecasts, risk analysis, and follow-up coaching in one dashboard, with pricing designed for the India market.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-foreground/72">
              <span className="rounded-full bg-muted px-4 py-2">Starter: {STARTER_PLAN_LIMIT} plans</span>
              <span className="rounded-full bg-muted px-4 py-2">Growth: up to {GROWTH_MONTHLY_PLAN_LIMIT}/month</span>
              <span className="rounded-full bg-muted px-4 py-2">Pro: unlimited + advanced analysis</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary">
                Start with Starter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary">Sign in</Link>
            </div>
          </div>
          <div className="glass-card overflow-hidden p-6">
            <div className="rounded-[28px] bg-slate-950 p-6 text-slate-50">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Revenue model</p>
              <h2 className="mt-4 text-2xl font-semibold">Starter to Growth, with Pro for deeper analysis</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Let new users experience quick wins on Starter, then upsell Growth for higher monthly usage and Pro for unlimited planning plus advanced analysis.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Starter</p>
                  <p className="pt-2 text-xl font-semibold">{STARTER_PLAN_LIMIT} plans</p>
                </div>
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Growth</p>
                  <p className="pt-2 text-xl font-semibold">{GROWTH_MONTHLY_PLAN_LIMIT}/mo</p>
                </div>
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Pro</p>
                  <p className="pt-2 text-xl font-semibold">Unlimited</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="mt-14 space-y-5">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold">Simple plans users can understand in under 10 seconds</h2>
            <p className="mt-3 text-sm leading-7 text-foreground/72">
              The offer is intentionally straightforward: Starter for evaluation, Growth for higher monthly usage, and Pro for unlimited work plus advanced analysis.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.tier}
                className={`glass-card flex flex-col p-6 ${plan.tier === "student" ? "border-primary/40 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]" : ""}`}
              >
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">{plan.name}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold">{plan.priceLabel}</span>
                  <span className="pb-1 text-sm text-foreground/60">{plan.cadence}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-foreground/72">{plan.description}</p>
                <div className="mt-5 rounded-2xl bg-muted px-4 py-3 text-sm font-medium text-foreground/80">{plan.highlight}</div>
                <div className="mt-5 space-y-3 text-sm text-foreground/80">
                  {plan.features.map((feature) => (
                    <p key={feature}>{feature}</p>
                  ))}
                </div>
                <Link href="/register" className="btn-secondary mt-6">
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
