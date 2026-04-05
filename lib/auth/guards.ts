import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export async function requireAuth() {
  const session = await getCurrentUserFromCookie();

  if (!session) {
    return {
      user: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }

  return { user: session, error: null };
}
