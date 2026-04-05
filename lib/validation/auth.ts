import { z } from "zod";
import { sanitizeText } from "@/lib/utils";

export const registerSchema = z.object({
  name: z.string().min(2).max(60).transform(sanitizeText),
  email: z.string().email().max(120).transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(64)
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
});

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(64)
});
