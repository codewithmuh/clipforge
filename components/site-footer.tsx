import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          ClipForge — the open-source OpusClip alternative. Built by{" "}
          <Link
            href="https://www.youtube.com/@codewithmuh"
            target="_blank"
            className="text-foreground hover:underline"
          >
            @codewithmuh
          </Link>
          .
        </p>
        <div className="flex items-center gap-4">
          <Link href="/app" className="hover:text-foreground">
            App
          </Link>
          <Link
            href="https://github.com/codewithmuh/clipforge"
            target="_blank"
            className="hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
