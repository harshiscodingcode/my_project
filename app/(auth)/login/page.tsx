import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function LoginPage() {
  const user = await getCurrentUserFromCookie();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-foreground/70">Sign in to generate and manage your business plans.</p>
        </div>
        <AuthForm mode="login" />
        <p className="text-sm text-foreground/70">New here? <Link href="/register" className="font-semibold text-primary">Create an account</Link></p>
      </div>
    </main>
  );
}
