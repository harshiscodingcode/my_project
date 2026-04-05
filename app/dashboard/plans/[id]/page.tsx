import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { currency } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";
import { PlanModel } from "@/models/Plan";
import { serializePlan } from "@/lib/plan-formatter";

type ChatAssistantMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUserFromCookie();
  await connectToDatabase();

  const plan = await PlanModel.findOne({ _id: id, userId: user?.userId }).lean();
  if (!plan) notFound();

  const serialized = serializePlan(plan);
  const roadmap = (serialized.roadmap ?? []).map((step) => ({
    _id: String(step._id),
    day: Number(step.day ?? 0),
    title: step.title ?? "Untitled step",
    description: step.description ?? "",
    done: Boolean(step.done)
  }));
  const chatHistory: ChatAssistantMessage[] = (serialized.chatHistory ?? []).map((item) => ({
    role: item.role === "assistant" ? "assistant" : "user",
    content: item.content ?? "",
    createdAt: item.createdAt
  }));

  return (
    <div className="space-y-8">
      <section className="glass-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Business plan</p>
            <h1 className="mt-3 text-3xl font-semibold">{serialized.businessIdea ?? "Untitled plan"}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/75">{serialized.summary ?? ""}</p>
          </div>
          <a href={`/api/plans/${serialized._id}/export`} className="btn-secondary">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-primary">Demand: {serialized.marketDemand?.label ?? "Low"} ({serialized.marketDemand?.score ?? 0}/100)</span>
          <Link href="/dashboard" className="rounded-full bg-muted px-4 py-2">Back to dashboard</Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold">Execution plan</h2>
          <div className="prose-plan mt-6 text-sm text-foreground/80">
            <h3>Required tools</h3>
            <ul>{(serialized.requiredTools ?? []).map((tool) => <li key={tool}>{tool}</li>)}</ul>
            <h3>Cost breakdown</h3>
            <ul>{(serialized.costBreakdown ?? []).map((cost, index) => <li key={`${cost.item ?? "item"}-${index}`}>{cost.item ?? "Item"}: {currency(Number(cost.cost ?? 0))}</li>)}</ul>
            <h3>Revenue estimation</h3>
            <ul>
              <li>Month 1: {currency(Number(serialized.revenueEstimation?.month1 ?? 0))}</li>
              <li>Month 3: {currency(Number(serialized.revenueEstimation?.month3 ?? 0))}</li>
              <li>Month 6: {currency(Number(serialized.revenueEstimation?.month6 ?? 0))}</li>
              {(serialized.revenueEstimation?.assumptions ?? []).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
            </ul>
            <h3>Risk analysis</h3>
            <ul>{(serialized.riskAnalysis ?? []).map((risk, index) => <li key={`${risk}-${index}`}>{risk}</li>)}</ul>
            <h3>Market demand reasons</h3>
            <ul>{(serialized.marketDemand?.reasons ?? []).map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}</ul>
          </div>
        </div>

        <ProgressTracker planId={serialized._id} roadmap={roadmap} />
      </section>

      <ChatAssistant planId={serialized._id} initialMessages={chatHistory} />
    </div>
  );
}
