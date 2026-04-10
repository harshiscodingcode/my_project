import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "AI Business Planner",
  description: "Sellable AI business-planning SaaS with free-to-paid pricing, execution tracking, chat, and export workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative bg-transparent">
        {/* Universal Global Background */}
        <div className="pointer-events-none fixed inset-0 z-[-2] bg-background transition-colors duration-300" />
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[url('/bg-login.png')] bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-60 mix-blend-screen" />
        <div className="pointer-events-none fixed inset-0 z-[0] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,hsl(var(--background))_100%)] dark:bg-[linear-gradient(180deg,rgba(10,14,23,0)_0%,rgba(6,9,15,0.9)_100%)]" />

        <ThemeProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
