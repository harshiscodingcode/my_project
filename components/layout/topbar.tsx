import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(8,12,22,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo size="compact" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/#pricing" className="hidden text-sm font-medium text-foreground/62 transition hover:text-foreground md:inline-flex">
            Pricing
          </Link>
          <Link href="/login" className="btn-secondary hidden rounded-full sm:inline-flex">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary rounded-full">
            Start planning
          </Link>
        </div>
      </div>
    </header>
  );
}
