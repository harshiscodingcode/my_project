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
      <aside className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(10,14,23,0.92)] p-4 pt-[var(--safe-top)] backdrop-blur-md sm:p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-stretch">
            <Logo size="sidebar" />
            <div className="flex items-center gap-2 lg:justify-between lg:gap-3">
              <ThemeToggle />
              <a href="/api/auth/logout" className="btn-secondary inline-flex h-10 items-center justify-center rounded-full px-3 lg:h-11 lg:px-4">
                <LogOut className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </a>
            </div>
          </div>
          <nav className="flex items-center justify-around gap-1 lg:grid lg:gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium text-foreground/72 transition hover:bg-white/5 hover:text-foreground lg:min-h-12 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-3 lg:text-sm"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary lg:h-4 lg:w-4" />
                <span className="lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="app-shell px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
