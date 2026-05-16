import { Flame, Smartphone, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    eyebrow: "ViralScore /10",
    title: "AI scores every moment for shareability.",
    body: "Claude or Gemini reads the full transcript, weighs hook strength, payoff, and curiosity gap, and ranks each segment from 0 – 10. Anything under 6 is dropped — you only see what's worth posting.",
    icon: Flame,
  },
  {
    eyebrow: "AutoReframe 9:16",
    title: "Cut + reframe to 1080×1920. Done.",
    body: "yt-dlp pulls the source. ffmpeg cuts each clip to the AI-picked range, center-crops to 9:16, and re-encodes at 1080×1920 — native dimensions for Shorts, TikTok, and Reels.",
    icon: Smartphone,
  },
  {
    eyebrow: "BYOK = $0",
    title: "Your key. Your bill. Zero markup.",
    body: "Drop your Anthropic or Gemini key in .env. Inference cost goes directly to the provider — usually fractions of a cent per video. ClipForge takes nothing. We never see your key.",
    icon: KeyRound,
  },
];

export function FeatureRows() {
  return (
    <section className="mt-20 sm:mt-28 space-y-16 sm:space-y-24">
      {FEATURES.map((feat, i) => {
        const reverse = i % 2 === 1;
        const Icon = feat.icon;
        return (
          <div
            key={feat.eyebrow}
            className={cn(
              "grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center",
            )}
          >
            <div className={cn("space-y-4", reverse && "lg:order-2")}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                <Icon className="h-3 w-3" />
                {feat.eyebrow}
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                {feat.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                {feat.body}
              </p>
            </div>
            <div
              className={cn(
                "relative aspect-[4/3] rounded-2xl border border-border bg-foreground/[0.02] overflow-hidden",
                reverse && "lg:order-1",
              )}
            >
              <FeatureVisual variant={i} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function FeatureVisual({ variant }: { variant: number }) {
  if (variant === 0) {
    // ViralScore visual — transcript spans with score chips
    return (
      <div className="absolute inset-0 p-6 sm:p-8 font-mono text-[11px] sm:text-xs space-y-2.5 overflow-hidden">
        {[
          { text: "Welcome back to the channel, today we're…", score: null },
          { text: "Wait — I was completely wrong about this.", score: 9.4 },
          { text: "So, anyway, before we get started…", score: null },
          {
            text: "Here's the one prompt that 10x'd my output:",
            score: 8.7,
          },
          { text: "Like, share, and don't forget to subscribe.", score: null },
          {
            text: "I spent $40k testing this so you don't have to.",
            score: 9.1,
          },
          { text: "Anyway, in the next video we'll cover…", score: null },
        ].map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 transition-opacity",
              !line.score && "opacity-40",
            )}
          >
            <span className="text-muted-foreground/60 w-10 shrink-0">
              {String(i).padStart(2, "0")}:{(i * 17).toString().padStart(2, "0")}
            </span>
            <span
              className={cn(
                "flex-1",
                line.score
                  ? "text-foreground bg-[color:var(--color-primary)]/10 px-1.5 -mx-1.5 rounded"
                  : "text-muted-foreground/70",
              )}
            >
              {line.text}
            </span>
            {line.score && (
              <span className="rounded-md bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] px-2 py-0.5 text-[10px] font-semibold tabular-nums shrink-0">
                {line.score.toFixed(1)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (variant === 1) {
    // AutoReframe visual — 16:9 source collapsing into 9:16
    return (
      <div className="absolute inset-0 p-8 grid place-items-center">
        <div className="relative w-full max-w-md">
          <div className="aspect-video w-full rounded-xl border border-border bg-gradient-to-br from-foreground/5 to-foreground/[0.02] overflow-hidden relative">
            <div className="absolute inset-0 grid place-items-center text-xs font-mono text-muted-foreground/60">
              16:9 source
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[88%] border-2 border-[color:var(--color-primary)] rounded-lg shadow-[0_0_0_4000px_rgba(0,0,0,0.45)]">
              <div className="absolute -top-6 left-0 text-[10px] font-mono text-[color:var(--color-primary)]">
                ⤓ crop 9:16
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-20 sm:w-24 aspect-[9/16] rounded-xl border border-[color:var(--color-primary)]/50 bg-[color:var(--color-primary)]/10 overflow-hidden glow-primary">
            <div className="absolute inset-0 grid place-items-center text-[9px] sm:text-[10px] font-mono text-[color:var(--color-primary)] text-center px-1">
              1080×
              <br />
              1920
            </div>
          </div>
        </div>
      </div>
    );
  }
  // BYOK visual — key flowing browser → provider, server bypassed
  return (
    <div className="absolute inset-0 p-8 grid place-items-center">
      <div className="grid grid-cols-3 gap-3 items-center w-full max-w-md">
        <Cell label="Your browser" sub="sk-ant-…" active />
        <div className="flex items-center justify-center text-[color:var(--color-primary)]">
          <svg viewBox="0 0 80 24" className="w-full h-6">
            <defs>
              <marker
                id="arr"
                markerWidth="10"
                markerHeight="10"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
              </marker>
            </defs>
            <path
              d="M2 12 L72 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              markerEnd="url(#arr)"
            />
          </svg>
        </div>
        <Cell label="Anthropic / Gemini" sub="charges $0.01" active />
        <div className="col-span-3 mt-2 flex justify-center">
          <div className="rounded-lg border border-dashed border-border bg-foreground/[0.02] px-4 py-2 text-[10px] font-mono text-muted-foreground/50 line-through">
            ClipForge server (never sees your key)
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({
  label,
  sub,
  active,
}: {
  label: string;
  sub: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-3 text-center",
        active
          ? "border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/[0.06]"
          : "border-border bg-foreground/[0.02]",
      )}
    >
      <div className="text-xs font-semibold">{label}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-1">
        {sub}
      </div>
    </div>
  );
}
