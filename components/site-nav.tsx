import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[color:var(--color-primary)] to-orange-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            ClipForge
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#features"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="https://github.com/codewithmuh/clipforge"
            target="_blank"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            GitHub
          </Link>
          <ThemeToggle className="ml-2" />
          <Link href="/app" className="ml-2">
            <Button size="sm">Open app</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
