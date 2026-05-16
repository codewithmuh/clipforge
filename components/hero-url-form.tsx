"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractYouTubeId } from "@/lib/youtube-shared";

export function HeroUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = extractYouTubeId(url);
    if (!id) {
      setError("That doesn't look like a YouTube URL.");
      return;
    }
    setPending(true);
    router.push(`/app?v=${id}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl flex flex-col gap-2"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube URL — https://youtube.com/watch?v=…"
          className="h-14 text-base sm:flex-1"
          autoFocus
          spellCheck={false}
        />
        <Button
          type="submit"
          size="lg"
          className="h-14 sm:w-48"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Find viral moments
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-red-400 px-2">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground px-2">
          Free with your own Anthropic or Gemini key. Nothing is stored without
          your permission.
        </p>
      )}
    </form>
  );
}
