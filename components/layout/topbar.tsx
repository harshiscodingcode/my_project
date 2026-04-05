import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn-secondary hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary">
            Start planning
          </Link>
        </div>
      </div>
    </header>
  );
}
