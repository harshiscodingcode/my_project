import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const roadmapStepSchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  { _id: true }
);

const planSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    inputs: {
      skills: { type: String, required: true },
      interests: { type: String, required: true },
      budget: { type: Number, required: true },
      timeAvailability: { type: String, required: true }
    },
    businessIdea: { type: String, required: true, index: "text" },
    summary: { type: String, required: true },
    roadmap: [roadmapStepSchema],
    requiredTools: [{ type: String }],
    costBreakdown: [{ item: String, cost: Number }],
    revenueEstimation: {
      month1: Number,
      month3: Number,
      month6: Number,
      assumptions: [String]
    },
    riskAnalysis: [{ type: String }],
    marketDemand: {
      score: Number,
      label: { type: String, enum: ["Low", "Moderate", "High"] },
      reasons: [String]
    },
    chatHistory: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

planSchema.index({ userId: 1, createdAt: -1 });

export type PlanDocument = InferSchemaType<typeof planSchema> & { _id: string };

export const PlanModel = (models.Plan as Model<PlanDocument>) || model<PlanDocument>("Plan", planSchema);
