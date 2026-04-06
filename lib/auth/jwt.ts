import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";
import type { UserJwtPayload } from "@/types";

export const JWT_COOKIE = "abp_token";

function getSecret() {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export function getAuthCookieOptions() {
  const env = getEnv();
  const useSecureCookie = env.NEXT_PUBLIC_APP_URL.startsWith("https://");

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: useSecureCookie,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

export async function signUserToken(payload: UserJwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyUserToken(token: string) {
  const result = await jwtVerify<UserJwtPayload>(token, getSecret());
  return result.payload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE, token, getAuthCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE, "", {
    ...getAuthCookieOptions(),
    expires: new Date(0),
    maxAge: 0
  });
}

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE)?.value;

  if (!token) return null;

  try {
    return await verifyUserToken(token);
  } catch {
    return null;
  }
}
