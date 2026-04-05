import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

declare global {
  var mongooseConnection: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConnection ?? { conn: null, promise: null };

export async function connectToDatabase() {
  const env = getEnv();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production",
      dbName: "ai-business-planner"
    });
  }

  cached.conn = await cached.promise;
  global.mongooseConnection = cached;
  return cached.conn;
}
