import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE, getCurrentUserFromCookie, verifyUserToken } from "@/lib/auth/jwt";

export async function requireAuth(request?: NextRequest) {
  const requestToken = request?.cookies.get(JWT_COOKIE)?.value;

  if (requestToken) {
    try {
      const user = await verifyUserToken(requestToken);
      return { user, error: null };
    } catch {
      return {
        user: null,
        error: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      };
    }
  }

  const session = await getCurrentUserFromCookie();

  if (!session) {
    return {
      user: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }

  return { user: session, error: null };
}
