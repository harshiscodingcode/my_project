import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "compact" | "default" | "hero" | "sidebar";
  centered?: boolean;
};

export function Logo({ size = "default", centered = false }: LogoProps) {
  const classes = {
    compact: {
      wrap: "gap-2.5",
      badge: "h-11 w-11 rounded-xl",
      title: "text-lg",
      subtitle: "text-[10px]"
    },
    default: {
      wrap: "gap-3",
      badge: "h-14 w-14 rounded-2xl",
      title: "text-xl",
      subtitle: "text-xs"
    },
    hero: {
      wrap: "gap-4",
      badge: "h-24 w-24 rounded-[28px] sm:h-28 sm:w-28",
      title: "text-[2rem] sm:text-[2.35rem]",
      subtitle: "text-sm sm:text-base"
    },
    sidebar: {
      wrap: "gap-3",
      badge: "h-12 w-12 rounded-2xl",
      title: "text-base",
      subtitle: "text-[10px]"
    }
  }[size];

  return (
    <Link href="/" className={cn("group flex items-center text-left", classes.wrap, centered && "justify-center")}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(20,29,48,0.92),rgba(12,18,31,0.98))] shadow-[0_16px_34px_rgba(0,0,0,0.34)]",
          classes.badge
        )}
      >
        <img
          src="/logo.jpg"
          alt="Idea2empire Banner Icon"
          className="absolute inset-0 h-[150%] w-[150%] max-w-none object-cover object-[center_20%] mix-blend-lighten"
        />
      </div>
      <div>
        <p className={cn("font-semibold leading-none tracking-tight text-[#ddb18d]", classes.title)}>Idea2empire</p>
        <p className={cn("mt-1 text-[#a88467]/90", classes.subtitle)}>AI Business Planning Engine</p>
      </div>
    </Link>
  );
}

