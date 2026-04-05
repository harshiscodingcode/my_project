import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/jwt";
import { getEnv } from "@/lib/env";

export async function GET() {
  const env = getEnv();
  await clearAuthCookie();
  return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_APP_URL));
}
