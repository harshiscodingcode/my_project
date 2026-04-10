"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="btn-secondary h-11 w-11 rounded-full p-0"
      onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
      aria-label="Toggle theme"
      disabled={!mounted}
    >
      {mounted ? (
        isDarkTheme ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />
      ) : (
        <span className="block h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
