"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Is it actually free?",
    a: "Yes. ClipForge is MIT-licensed and there is no hosted tier. The only thing you pay for is the AI inference, and that goes directly to Anthropic or Google — not us. Most short videos cost less than $0.01 to analyze.",
  },
  {
    q: "Why BYOK?",
    a: "Because it keeps the product free and your data private. Your key sits in .env (self-hosted) or your browser's local storage. The Next.js server proxies the request to Anthropic / Gemini and never logs the key. We don't have a database of customer secrets.",
  },
  {
    q: "Will my video data be stored?",
    a: "By default ClipForge stores: the YouTube URL, the AI ranking output, and a hash of your IP for rate-limiting analytics. That's it. The transcript is fetched on-demand from YouTube and not persisted. You can self-host and turn off persistence entirely.",
  },
  {
    q: "Does it work for any YouTube video?",
    a: "Any public YouTube video with captions enabled — auto-captions count. Members-only, age-gated, and unlisted videos won't work because the transcript isn't accessible.",
  },
  {
    q: "How does the 9:16 reframe work?",
    a: "ffmpeg center-crops the source frame and scales to 1080×1920. It's not subject-tracking yet — speakers near the center of the original frame work great, edge-of-frame shots will be cropped out. Subject-tracking reframe is on the roadmap.",
  },
  {
    q: "Can I add captions?",
    a: "You can already export SRT and WebVTT alongside each clip. Burning captions directly into the MP4 is one ffmpeg filter away — open an issue if you want it prioritized.",
  },
  {
    q: "What kind of videos work best?",
    a: "Anything with real spoken content — podcasts, talks, tutorials, interviews, reviews. The AI ranks moments by what reads as a self-contained hook + payoff, so videos with clear storytelling beats produce the highest-scoring clips. Pure b-roll, music videos, and visuals-only content won't have much to rank.",
  },
  {
    q: "Can I deploy this for my team?",
    a: "Yes. The frontend deploys to Vercel in one command, the backend is a standard Django app on Render / Fly / Vercel Sandbox. ffmpeg + yt-dlp can't run inside Vercel's serverless functions, so the render worker needs a real container.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mt-20 sm:mt-28 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          FAQ
        </div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Questions, answered honestly.
        </h2>
      </div>

      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-foreground/[0.02] overflow-hidden divide-y divide-border">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left transition-colors",
                  "hover:bg-foreground/[0.03]",
                )}
              >
                <span className="text-sm sm:text-base font-medium">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180 text-[color:var(--color-primary)]",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 sm:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
