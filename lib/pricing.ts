export const STARTER_PLAN_LIMIT = 2;
export const GROWTH_MONTHLY_PLAN_LIMIT = 50;

export const planTierOrder = ["free", "student", "pro"] as const;

export type PlanTier = (typeof planTierOrder)[number];

export const pricingPlans = [
  {
    tier: "free" as const,
    name: "Starter",
    priceLabel: "Rs 0",
    cadence: "forever",
    description: "Best for first-time founders validating one or two ideas before committing.",
    highlight: `Up to ${STARTER_PLAN_LIMIT} plans total`,
    ctaLabel: "Start with Starter",
    features: [
      `${STARTER_PLAN_LIMIT} AI business plans`,
      "30-day launch roadmap",
      "Basic market demand score",
      "Progress tracking dashboard"
    ]
  },
  {
    tier: "student" as const,
    name: "Growth",
    priceLabel: "Rs 99",
    cadence: "per month",
    description: "A stronger paid tier for founders who need more room to test and refine ideas.",
    highlight: `Up to ${GROWTH_MONTHLY_PLAN_LIMIT} plans/month`,
    ctaLabel: "Choose Growth",
    features: [
      `${GROWTH_MONTHLY_PLAN_LIMIT} AI business plans each month`,
      "Unlimited follow-up chat",
      "PDF export and saved history",
      "Built for affordable monthly upgrades"
    ]
  },
  {
    tier: "pro" as const,
    name: "Pro",
    priceLabel: "Rs 299",
    cadence: "per month",
    description: "For serious operators who want unrestricted planning and deeper decision support.",
    highlight: "Unlimited + advanced analysis",
    ctaLabel: "Choose Pro",
    features: [
      "Unlimited AI business plans",
      "Advanced analysis and stronger plan depth",
      "Priority support and faster iteration",
      "Built for teams and power users"
    ]
  }
];

export function getTierLabel(tier: PlanTier) {
  return pricingPlans.find((plan) => plan.tier === tier)?.name ?? "Starter";
}
