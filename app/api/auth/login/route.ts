import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { signUserToken, setAuthCookie } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/rate-limit";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
  const allowed = await rateLimit(`login:${request.headers.get("x-forwarded-for") ?? "local"}`, 15, 60);
  if (!allowed) return NextResponse.json({ message: "Too many requests" }, { status: 429 });

  const payload = loginSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Invalid credentials" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await UserModel.findOne({ email: payload.data.email });
  if (!user || !(await verifyPassword(payload.data.password, user.passwordHash))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  await setAuthCookie(await signUserToken({ userId: user._id.toString(), email: user.email }));
  return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
}
