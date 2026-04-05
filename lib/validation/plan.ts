import { z } from "zod";
import { sanitizeText } from "@/lib/utils";

export const plannerSchema = z.object({
  skills: z
    .string()
    .trim()
    .min(2, "Tell us a little about your skills so we can tailor the plan.")
    .max(400, "Keep the skills section under 400 characters.")
    .transform(sanitizeText),
  interests: z
    .string()
    .trim()
    .min(2, "Share at least one interest or business area you want to explore.")
    .max(400, "Keep the interests section under 400 characters.")
    .transform(sanitizeText),
  budget: z.coerce
    .number({ invalid_type_error: "Enter your budget in INR." })
    .min(0, "Budget cannot be negative.")
    .max(100000, "For now, enter a budget up to Rs 1,00,000."),
  timeAvailability: z
    .string()
    .trim()
    .min(2, "Tell us how much time you can give each week.")
    .max(120, "Keep time availability under 120 characters.")
    .transform(sanitizeText)
});

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Type a question for the assistant.")
    .max(800, "Keep your question under 800 characters.")
    .transform(sanitizeText)
});

export const taskToggleSchema = z.object({
  stepId: z.string().min(1),
  done: z.boolean()
});
