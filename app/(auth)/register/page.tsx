import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function RegisterPage() {
  const user = await getCurrentUserFromCookie();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">Create your workspace</h1>
          <p className="mt-2 text-sm text-foreground/70">Start generating lean business plans in minutes.</p>
        </div>
        <AuthForm mode="register" />
        <p className="text-sm text-foreground/70">Already have an account? <Link href="/login" className="font-semibold text-primary">Sign in</Link></p>
      </div>
    </main>
  );
}
