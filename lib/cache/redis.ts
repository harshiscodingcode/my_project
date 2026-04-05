import Redis from "ioredis";
import { getEnv } from "@/lib/env";

declare global {
  var redisClient: Redis | null | undefined;
}

export function getRedis() {
  const env = getEnv();
  if (!env.REDIS_URL) {
    return null;
  }

  if (!global.redisClient) {
    global.redisClient = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1
    });
  }

  return global.redisClient;
}

export async function getCachedValue<T>(key: string) {
  const client = getRedis();
  if (!client) return null;

  try {
    if (client.status === "wait") {
      await client.connect();
    }
    const payload = await client.get(key);
    return payload ? (JSON.parse(payload) as T) : null;
  } catch {
    return null;
  }
}

export async function setCachedValue<T>(key: string, value: T, ttlSeconds: number) {
  const client = getRedis();
  if (!client) return;

  try {
    if (client.status === "wait") {
      await client.connect();
    }
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
  }
}
