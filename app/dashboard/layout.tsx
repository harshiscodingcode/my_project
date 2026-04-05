import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentUserFromCookie } from "@/lib/auth/jwt";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserFromCookie();
  if (!user) redirect("/login");

  return <DashboardShell>{children}</DashboardShell>;
}
