import Link from "next/link";
import { ArrowRight, Brain, Gauge, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

const features = [
  {
    icon: Brain,
    title: "AI-first plan generation",
    description: "Turn your skills, interests, budget, and time into a structured 30-day launch blueprint."
  },
  {
    icon: Gauge,
    title: "Lightning-fast planning",
    description: "Get from idea to action quickly with responsive dashboards and fast-loading plan workflows."
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    description: "Keep your account, plans, and founder data protected with secure authentication and guarded workflows."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Launch faster with AI
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              Build a profitable business plan before you spend months guessing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72">
              AI Business Planner helps founders and side hustlers generate realistic business ideas, execution roadmaps, cost forecasts, risk analysis, and follow-up coaching in one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary">Sign in</Link>
            </div>
          </div>
          <div className="glass-card overflow-hidden p-6">
            <div className="rounded-[28px] bg-slate-950 p-6 text-slate-50">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Sample outcome</p>
              <h2 className="mt-4 text-2xl font-semibold">AI-Powered Local Marketing Studio</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Offer fast social content, lead magnets, and review campaigns for local businesses using automations and lightweight service packaging.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Budget</p>
                  <p className="pt-2 text-xl font-semibold">Rs 5,000</p>
                </div>
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Demand</p>
                  <p className="pt-2 text-xl font-semibold">High</p>
                </div>
                <div className="flex min-h-[112px] flex-col justify-between rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">30-day goal</p>
                  <p className="pt-2 text-xl font-semibold">3 paying clients</p>
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
      </main>
    </div>
  );
}
