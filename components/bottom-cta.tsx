"use client";

import { useState } from "react";
import { Link2, Wand2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { extractYouTubeId } from "@/lib/youtube-shared";

export function BottomCta() {
  const router = useRouter();
  const search = useSearchParams();
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = extractYouTubeId(url);
    if (!id) {
      setError("That doesn't look like a YouTube URL.");
      return;
    }
    setError(null);
    setPending(true);
    // Use shallow URL change so the dashboard above mounts its loader,
    // then scroll back to the top so user sees the result, not the CTA.
    const params = new URLSearchParams(search.toString());
    params.set("v", id);
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="mt-20 sm:mt-28 relative">
      <div className="relative rounded-3xl border border-border bg-gradient-to-br from-foreground/[0.04] via-foreground/[0.02] to-[color:var(--color-primary)]/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-radial-fade opacity-60 pointer-events-none" />
        <div className="relative px-6 sm:px-12 py-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
            Ready to{" "}
            <span className="bg-gradient-to-br from-foreground via-foreground to-[color:var(--color-primary)] bg-clip-text text-transparent">
              clip something viral?
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            One paste. Three clicks. Real 9:16 MP4s ready to post.
          </p>

          <form
            onSubmit={submit}
            className="mt-7 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1.5 pl-5 shadow-lg shadow-[color:var(--color-primary)]/5 focus-within:shadow-[0_0_0_1px_rgba(255,59,48,0.4),0_8px_40px_-8px_rgba(255,59,48,0.35)] transition-shadow">
              <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a YouTube link…"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-full shrink-0"
                disabled={pending || !url.trim()}
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Loading</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Get clips
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500 dark:text-red-300">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
