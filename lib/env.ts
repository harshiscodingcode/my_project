import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  AI_PROVIDER: z.enum(["groq", "gemini"]).default("groq"),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional()
});

export function getEnv() {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    AI_PROVIDER: process.env.AI_PROVIDER,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  });
}
