import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { Logo } from "@/components/shared/logo";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function LoginPage() {
  const user = await getCurrentUserFromCookie();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-4">
      <div className="w-full space-y-7">
        <div className="space-y-4 text-center">
          <Logo size="hero" centered />
          <div>
            <h1 className="mt-4 text-[1.8rem] font-semibold tracking-wide text-[#e8c89b]">Welcome back</h1>
            <p className="mt-2 text-[13px] text-foreground/50">Sign in to continue building and refining your ideas.</p>
          </div>
        </div>
        
        <AuthForm mode="login" />
        
        <p className="text-center text-[13px] text-white/50">
          New here? <Link href="/register" className="font-semibold text-[#cf9e50] transition hover:text-[#e8c89b]">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

