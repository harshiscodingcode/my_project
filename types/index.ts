export type UserJwtPayload = { userId: string; email: string };

export type PlannerFormInput = {
  skills: string;
  interests: string;
  budget: number;
  timeAvailability: string;
};

export type RoadmapStep = {
  day: number;
  title: string;
  description: string;
  done: boolean;
};

export type BusinessPlanContent = {
  businessIdea: string;
  summary: string;
  roadmap: RoadmapStep[];
  requiredTools: string[];
  costBreakdown: { item: string; cost: number }[];
  revenueEstimation: {
    month1: number;
    month3: number;
    month6: number;
    assumptions: string[];
  };
  riskAnalysis: string[];
  marketDemand: {
    score: number;
    label: "Low" | "Moderate" | "High";
    reasons: string[];
  };
};

export type PlanChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
