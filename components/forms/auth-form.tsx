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
      body: JSON.stringify(values)
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? "Request failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-5 p-8">
      {mode === "register" && (
        <div>
          <label className="mb-2 block text-sm font-medium">Full name</label>
          <input className="input-base" {...register("name")} placeholder="Maya Carter" />
          <p className="mt-2 text-xs text-danger">{String(formState.errors.name?.message ?? "")}</p>
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <input className="input-base" type="email" {...register("email")} placeholder="you@example.com" />
        <p className="mt-2 text-xs text-danger">{String(formState.errors.email?.message ?? "")}</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <input className="input-base" type="password" {...register("password")} placeholder="Strong password" />
        <p className="mt-2 text-xs text-danger">{String(formState.errors.password?.message ?? "")}</p>
      </div>
      {error && <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      <button className="btn-primary w-full" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
