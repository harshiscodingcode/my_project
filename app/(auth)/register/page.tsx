import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { Logo } from "@/components/shared/logo";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function RegisterPage() {
  const user = await getCurrentUserFromCookie();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-4">
      <div className="w-full space-y-7">
        <div className="space-y-4 text-center">
          <Logo size="hero" centered />
          <div>
            <h1 className="mt-4 text-[1.8rem] font-semibold tracking-wide text-[#e8c89b]">Create your workspace</h1>
            <p className="mt-2 text-[13px] text-foreground/50">Launch your business planning engine with a cleaner, premium workflow.</p>
          </div>
        </div>
        
        <AuthForm mode="register" />
        
        <p className="text-center text-[13px] text-white/50">
          Already have an account? <Link href="/login" className="font-semibold text-[#cf9e50] transition hover:text-[#e8c89b]">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

