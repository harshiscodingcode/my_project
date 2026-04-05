import { getEnv } from "@/lib/env";
import type { BusinessPlanContent, PlannerFormInput, PlanChatMessage } from "@/types";

function buildPlanPrompt(input: PlannerFormInput, marketDemand: BusinessPlanContent["marketDemand"]) {
  return `You are an expert startup strategist.
Return only valid JSON with this exact shape:
{
  "businessIdea": "string",
  "summary": "string",
  "roadmap": [{"day": 1, "title": "string", "description": "string", "done": false}],
  "requiredTools": ["string"],
  "costBreakdown": [{"item": "string", "cost": 0}],
  "revenueEstimation": {
    "month1": 0,
    "month3": 0,
    "month6": 0,
    "assumptions": ["string"]
  },
  "riskAnalysis": ["string"]
}

Requirements:
- Make roadmap exactly 30 steps, one per day, with realistic momentum.
- Keep business idea lean and bootstrapped.
- All money values must be in INR.
- Budget ceiling: ${input.budget} INR.
- User skills: ${input.skills}
- User interests: ${input.interests}
- Time availability: ${input.timeAvailability}
- Market demand indicator: ${marketDemand.label} (${marketDemand.score}/100)
- Do not include markdown or extra text.`;
}

function buildChatPrompt(plan: string, history: PlanChatMessage[], message: string) {
  return `You are an AI business coach. Use the saved plan below as the primary context.
Plan:
${plan}

Conversation:
${history.map((item) => `${item.role.toUpperCase()}: ${item.content}`).join("\n")}

Latest user question: ${message}

Respond with concise, practical guidance in plain text.`;
}

async function callGroq(prompt: string) {
  const env = getEnv();
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Groq request failed");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content as string;
}

async function callGemini(prompt: string) {
  const env = getEnv();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text as string;
}

async function callAI(prompt: string) {
  const env = getEnv();

  if (env.AI_PROVIDER === "gemini") {
    if (!env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    return callGemini(prompt);
  }

  if (!env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  return callGroq(prompt);
}

function normalizePlanContent(raw: string, marketDemand: BusinessPlanContent["marketDemand"]): BusinessPlanContent {
  const json = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
  return {
    ...json,
    roadmap: (json.roadmap ?? []).slice(0, 30).map((step: BusinessPlanContent["roadmap"][number], index: number) => ({
      ...step,
      day: Number(step.day || index + 1),
      done: Boolean(step.done)
    })),
    marketDemand
  };
}

export async function generateBusinessPlan(input: PlannerFormInput, marketDemand: BusinessPlanContent["marketDemand"]) {
  const raw = await callAI(buildPlanPrompt(input, marketDemand));
  return normalizePlanContent(raw, marketDemand);
}

export async function continueBusinessChat({
  planSummary,
  history,
  message
}: {
  planSummary: string;
  history: PlanChatMessage[];
  message: string;
}) {
  return callAI(buildChatPrompt(planSummary, history, message));
}
