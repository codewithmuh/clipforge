"use client";

import { Flame, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseClip {
  title: string;
  score: number;
  duration: string;
  channel: string;
  thumbId: string;
  platforms: ("youtube" | "tiktok" | "instagram" | "x" | "linkedin")[];
  hue: string;
}

// Real public YouTube videos with widely available thumbnails — these never
// 404 and they make the empty state feel inhabited.
const CLIPS: ShowcaseClip[] = [
  {
    title: "The 4 books that rewired my brain",
    score: 9.4,
    duration: "0:48",
    channel: "Ali Abdaal",
    thumbId: "VkLBPVnvIuQ",
    platforms: ["youtube", "tiktok", "instagram"],
    hue: "from-orange-500/30 to-rose-500/30",
  },
  {
    title: "Why senior engineers say no",
    score: 8.7,
    duration: "0:54",
    channel: "Theo - t3.gg",
    thumbId: "7tEhPnKPgxg",
    platforms: ["youtube", "x", "linkedin"],
    hue: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    title: "I built an AI front desk in a weekend",
    score: 9.1,
    duration: "1:02",
    channel: "CodeWithMuh",
    thumbId: "5UQ49sNjJLU",
    platforms: ["youtube", "tiktok", "x"],
    hue: "from-emerald-500/30 to-cyan-500/30",
  },
  {
    title: "The interview question that flips it",
    score: 9.6,
    duration: "0:39",
    channel: "Y Combinator",
    thumbId: "CBYhVcO4WgI",
    platforms: ["youtube", "instagram", "linkedin"],
    hue: "from-amber-500/30 to-red-500/30",
  },
  {
    title: "How Claude actually thinks",
    score: 8.9,
    duration: "0:57",
    channel: "Anthropic",
    thumbId: "esCSpbDPJik",
    platforms: ["youtube", "x"],
    hue: "from-sky-500/30 to-indigo-500/30",
  },
  {
    title: "The hire that 10x'd my startup",
    score: 8.4,
    duration: "0:51",
    channel: "Lenny",
    thumbId: "KctRBVi65xQ",
    platforms: ["youtube", "linkedin", "tiktok"],
    hue: "from-pink-500/30 to-rose-500/30",
  },
];

const PLATFORM_GLYPHS: Record<ShowcaseClip["platforms"][number], string> = {
  youtube: "YT",
  tiktok: "TT",
  instagram: "IG",
  x: "X",
  linkedin: "in",
};

const PLATFORM_COLORS: Record<ShowcaseClip["platforms"][number], string> = {
  youtube: "bg-red-500 text-white",
  tiktok: "bg-black text-white border border-white/20",
  instagram: "bg-gradient-to-br from-pink-500 to-amber-400 text-white",
  x: "bg-black text-white border border-white/20",
  linkedin: "bg-[#0a66c2] text-white",
};

export function ClipShowcase() {
  // Duplicate the row so the marquee can loop seamlessly.
  const row = [...CLIPS, ...CLIPS];

  return (
    <section className="relative mt-12 sm:mt-16">
      <div className="flex items-baseline justify-between mb-5 px-1">
        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
          What ClipForge produces
        </h2>
        <span className="text-xs text-muted-foreground hidden sm:block">
          AI-ranked /10 · ready for Shorts, TikTok, Reels
        </span>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <ShowcaseCard key={`${c.thumbId}-${i}`} clip={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ clip }: { clip: ShowcaseClip }) {
  const scoreColor =
    clip.score >= 9
      ? "text-[color:var(--color-primary)]"
      : clip.score >= 8
        ? "text-amber-500 dark:text-amber-300"
        : "text-foreground/80";
  return (
    <div className="relative w-[180px] sm:w-[210px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-border shrink-0 group">
      <img
        src={`https://i.ytimg.com/vi/${clip.thumbId}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover scale-[1.6] transition-transform duration-700 group-hover:scale-[1.7]"
        loading="lazy"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          clip.hue,
          "mix-blend-overlay",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
        <span className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
          <Flame className={cn("h-2.5 w-2.5", scoreColor)} />
          <span className="tabular-nums">{clip.score.toFixed(1)}</span>
          <span className="text-white/50 text-[9px]">/10</span>
        </span>
      </div>

      <div className="absolute right-2.5 top-2.5">
        <span className="rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-white">
          {clip.duration}
        </span>
      </div>

      <div className="absolute inset-0 grid place-items-center opacity-90 group-hover:opacity-100 transition-opacity">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-black shadow-2xl scale-100 group-hover:scale-110 transition-transform">
          <Play className="h-4 w-4 fill-current translate-x-[1px]" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 space-y-1.5">
        <p className="text-white text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2">
          {clip.title}
        </p>
        <p className="text-white/60 text-[10px] font-medium">{clip.channel}</p>
        <div className="flex gap-1 pt-1">
          {clip.platforms.map((p) => (
            <span
              key={p}
              className={cn(
                "grid place-items-center h-4 w-4 rounded-full text-[8px] font-bold tracking-tighter",
                PLATFORM_COLORS[p],
              )}
              title={p}
            >
              {PLATFORM_GLYPHS[p]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
