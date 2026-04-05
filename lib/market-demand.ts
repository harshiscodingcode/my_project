const keywordMap = [
  { pattern: /(ai|automation|marketing|content|crm)/i, score: 24, reason: "Targets high-growth digital spend categories." },
  { pattern: /(health|fitness|wellness|education|finance)/i, score: 22, reason: "Operates in evergreen consumer demand markets." },
  { pattern: /(b2b|saas|productivity|workflow|analytics)/i, score: 26, reason: "Has room for recurring revenue and higher contract value." },
  { pattern: /(local|niche|community|creator|freelance)/i, score: 16, reason: "Can validate quickly with focused audiences and low acquisition cost." }
];

export function getMarketDemandIndicator(input: { skills: string; interests: string }) {
  const combined = `${input.skills} ${input.interests}`;
  let score = 30;
  const reasons: string[] = [];

  for (const item of keywordMap) {
    if (item.pattern.test(combined)) {
      score += item.score;
      reasons.push(item.reason);
    }
  }

  score = Math.max(20, Math.min(score, 96));
  const label = score >= 75 ? "High" : score >= 50 ? "Moderate" : "Low";

  if (reasons.length === 0) {
    reasons.push("No clear high-demand keyword cluster was detected, so validation should happen early.");
  }

  return { score, label: label as "Low" | "Moderate" | "High", reasons };
}
