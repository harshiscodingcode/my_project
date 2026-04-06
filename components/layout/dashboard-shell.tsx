import Link from "next/link";
import { LayoutDashboard, LogOut, Sparkles, Target } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";

const links = [
  { href: "/dashboard#overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard#create-plan", label: "Create Plan", icon: Sparkles },
  { href: "/dashboard#progress", label: "Progress", icon: Target }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-card/70 p-4 sm:p-6 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Logo />
            <div className="flex items-center gap-3 lg:mt-4 lg:justify-between">
              <ThemeToggle />
              <a href="/api/auth/logout" className="btn-secondary inline-flex h-11 rounded-full px-4">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </a>
            </div>
          </div>
          <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-muted"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="app-shell px-4 py-6 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
