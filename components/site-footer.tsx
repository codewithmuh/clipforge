import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo />
          <p className="text-xs text-muted-foreground">
            Open-source AI video clipper. MIT licensed.
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="#live-demo"
            className="text-muted-foreground hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            href="#self-host"
            className="text-muted-foreground hover:text-foreground"
          >
            Self-host
          </Link>
          <Link
            href="https://github.com/codewithmuh/clipforge"
            target="_blank"
            className="text-muted-foreground hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://www.youtube.com/@codewithmuh"
            target="_blank"
            className="text-muted-foreground hover:text-foreground"
          >
            @codewithmuh
          </Link>
        </div>
      </div>
    </footer>
  );
}
