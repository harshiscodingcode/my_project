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
    <div className="grid min-h-screen lg:grid-cols-[108px_1fr]">
      <aside className="border-b border-white/8 bg-[rgba(10,14,23,0.86)] p-4 sm:p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 lg:flex-col lg:items-stretch">
            <Logo size="sidebar" />
            <div className="flex items-center gap-3 lg:justify-between">
              <ThemeToggle />
              <a href="/api/auth/logout" className="btn-secondary inline-flex h-11 rounded-full px-4">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </a>
            </div>
          </div>
          <nav className="grid gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/72 transition hover:bg-white/5 hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="app-shell px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
