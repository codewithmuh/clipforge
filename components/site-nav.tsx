import Link from "next/link";
import { Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="#live-demo"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            href="#self-host"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Self-host
          </Link>
          <Link
            href="#faq"
            className="hidden sm:inline-block px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
          <Link
            href="https://github.com/codewithmuh/clipforge"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 ml-2 rounded-full border border-border bg-foreground/[0.04] hover:bg-foreground/[0.08] px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <Star className="h-3 w-3" />
            Star on GitHub
          </Link>
          <ThemeToggle className="ml-2" />
        </nav>
      </div>
    </header>
  );
}
