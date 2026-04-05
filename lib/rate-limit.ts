import { getRedis } from "@/lib/cache/redis";

const memoryStore = new Map<string, { count: number; expires: number }>();

export async function rateLimit(key: string, limit = 20, windowSeconds = 60) {
  const redis = getRedis();
  const now = Date.now();

  if (redis) {
    try {
      if (redis.status === "wait") {
        await redis.connect();
      }
      const redisKey = `rl:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.expire(redisKey, windowSeconds);
      }
      return count <= limit;
    } catch {
    }
  }

  const current = memoryStore.get(key);
  if (!current || current.expires < now) {
    memoryStore.set(key, { count: 1, expires: now + windowSeconds * 1000 });
    return true;
  }

  current.count += 1;
  memoryStore.set(key, current);
  return current.count <= limit;
}
