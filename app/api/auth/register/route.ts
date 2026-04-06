import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { JWT_COOKIE, getAuthCookieOptions, signUserToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/rate-limit";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const allowed = await rateLimit(`register:${request.headers.get("x-forwarded-for") ?? "local"}`, 10, 60);
    if (!allowed) return NextResponse.json({ message: "Too many requests" }, { status: 429 });

    const payload = registerSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await UserModel.findOne({ email: payload.data.email }).lean();
    if (existing) return NextResponse.json({ message: "Email already in use" }, { status: 409 });

    const user = await UserModel.create({
      name: payload.data.name,
      email: payload.data.email,
      passwordHash: await hashPassword(payload.data.password)
    });

    const token = await signUserToken({ userId: user._id.toString(), email: user.email });
    const response = NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } }, { status: 201 });
    response.cookies.set(JWT_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (error) {
    console.error("Register failed", error);
    return NextResponse.json({ message: "Unable to register right now" }, { status: 500 });
  }
}
