"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

type AuthMode = "login" | "register";
type AuthValues = {
  name?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const schema = mode === "login" ? loginSchema : registerSchema;
  const { register, handleSubmit, formState } = useForm<AuthValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values)
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      setError(typeof data.message === "string" && data.message ? data.message : "Request failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[#3e4453] bg-[#222532]/95 px-6 py-8 shadow-2xl backdrop-blur-xl sm:px-8">
      {mode === "register" && (
        <div className="mb-6">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#c09765]">Full name</label>
          <input 
            className="w-full rounded-2xl border border-[#4d5464] bg-[#2c303f] px-4 py-3 text-[13px] text-[#ecedf1] outline-none transition placeholder:text-[#a3a8b7] focus:border-[#c09765] focus:ring-1 focus:ring-[#c09765]/50" 
            {...register("name")} 
            placeholder="Maya Carter" 
          />
          <p className="mt-2 text-xs text-danger">{String(formState.errors.name?.message ?? "")}</p>
        </div>
      )}
      <div className="mb-6">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#c09765]">Email</label>
        <input 
          className="w-full rounded-2xl border border-[#4d5464] bg-[#2c303f] px-4 py-3 text-[13px] text-[#ecedf1] outline-none transition placeholder:text-[#a3a8b7] focus:border-[#c09765] focus:ring-1 focus:ring-[#c09765]/50" 
          type="email" 
          {...register("email")} 
          placeholder="you@example.com" 
        />
        <p className="mt-2 text-xs text-danger">{String(formState.errors.email?.message ?? "")}</p>
      </div>
      <div className="mb-8">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#c09765]">Password</label>
        <input 
          className="w-full rounded-2xl border border-[#4d5464] bg-[#2c303f] px-4 py-3 text-[13px] text-[#ecedf1] outline-none transition placeholder:text-[#a3a8b7] focus:border-[#c09765] focus:ring-1 focus:ring-[#c09765]/50" 
          type="password" 
          {...register("password")} 
          placeholder="Strong password" 
        />
        <p className="mt-2 text-xs text-danger">{String(formState.errors.password?.message ?? "")}</p>
      </div>
      {error && <p className="mb-6 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      <button 
        className="flex w-full items-center justify-center rounded-[20px] bg-[linear-gradient(to_right,#bea164,#e1c587,#ad8f55)] px-4 py-3.5 text-sm font-semibold text-[#282218] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_14px_rgba(225,197,135,0.25)]" 
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}

