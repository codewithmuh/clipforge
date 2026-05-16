"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_CLIPS, DEMO_SOURCE } from "@/lib/demo-clips";

export function LiveDemo() {
  return (
    <section id="live-demo" className="mt-8 sm:mt-10 scroll-mt-20">
      <DemoSlider />

      <p className="mt-5 text-center text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto text-balance">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/80 mr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live output
        </span>
        Real ClipForge run on{" "}
        <a
          href={`https://www.youtube.com/watch?v=${DEMO_SOURCE.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {DEMO_SOURCE.channel}'s Vision Pro video
        </a>{" "}
        — {DEMO_SOURCE.rankedCount} viral moments, top 4 rendered above as
        native 1080×1920 MP4s.
      </p>
    </section>
  );
}

function DemoSlider() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [muted, setMuted] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanPrev(scrollLeft > 4);
      setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
      const cards = Array.from(el.children) as HTMLElement[];
      const centers = cards.map(
        (c) =>
          Math.abs(
            c.offsetLeft - scrollLeft - clientWidth / 2 + c.clientWidth / 2,
          ),
      );
      const min = Math.min(...centers);
      setActive(centers.indexOf(min));
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!autoplay || hovering) return;
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }
    const id = window.setInterval(() => {
      const el = scroller.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        scrollToIndex(0);
      } else {
        const card = el.children[0] as HTMLElement | undefined;
        const step = (card?.clientWidth ?? 320) + 16;
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 7000);
    return () => window.clearInterval(id);
  }, [autoplay, hovering]);

  function scrollToIndex(i: number) {
    const el = scroller.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
  }

  function manualScroll(dir: 1 | -1) {
    setAutoplay(false);
    const el = scroller.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = (card?.clientWidth ?? 320) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground font-mono tabular-nums">
          {active + 1}{" "}
          <span className="text-muted-foreground/60">/ {DEMO_CLIPS.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <DemoBtn
            onClick={() => setMuted((m) => !m)}
            label={muted ? "Unmute" : "Mute"}
            icon={
              muted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )
            }
          />
          <DemoBtn
            onClick={() => setAutoplay((a) => !a)}
            label={autoplay ? "Pause" : "Play"}
            icon={
              autoplay ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5 translate-x-[1px]" />
              )
            }
            highlight={autoplay && !hovering}
          />
          <DemoBtn
            onClick={() => manualScroll(-1)}
            disabled={!canPrev}
            label="Previous"
            icon={<ChevronLeft className="h-4 w-4" />}
          />
          <DemoBtn
            onClick={() => manualScroll(1)}
            disabled={!canNext}
            label="Next"
            icon={<ChevronRight className="h-4 w-4" />}
          />
        </div>
      </div>

      <div
        ref={scroller}
        className={cn(
          "flex gap-4 overflow-x-auto pb-4",
          "snap-x snap-mandatory",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        {DEMO_CLIPS.map((c, i) => (
          <div
            key={c.file}
            className="snap-start shrink-0 w-[180px] sm:w-[200px] lg:w-[220px]"
          >
            <DemoCard clip={c} active={i === active} muted={muted} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {DEMO_CLIPS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setAutoplay(false);
              scrollToIndex(i);
            }}
            aria-label={`Go to clip ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active
                ? "w-6 bg-[color:var(--color-primary)]"
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function DemoCard({
  clip,
  active,
  muted,
}: {
  clip: (typeof DEMO_CLIPS)[number];
  active: boolean;
  muted: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {
        // Browsers reject auto-play with sound. We start muted, so this should
        // succeed — silently swallow anything weird.
      });
      setPlaying(true);
    } else {
      v.pause();
      v.currentTime = clip.posterFrame;
      setPlaying(false);
    }
  }, [active, clip.posterFrame]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  const scoreColor =
    clip.score >= 9
      ? "text-[color:var(--color-primary)]"
      : clip.score >= 8
        ? "text-amber-500 dark:text-amber-300"
        : "text-foreground/80";

  return (
    <div
      className={cn(
        "relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border transition-all",
        active
          ? "border-[color:var(--color-primary)]/40 shadow-[0_0_0_1px_rgba(255,59,48,0.25),0_24px_80px_-20px_rgba(255,59,48,0.45)]"
          : "border-border",
      )}
    >
      <video
        ref={videoRef}
        src={clip.file}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          if (v.paused) {
            v.play();
            setPlaying(true);
          } else {
            v.pause();
            setPlaying(false);
          }
        }}
      />

      {/* Top overlay: rank + score */}
      <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1">
        <span className="rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
          #{clip.rank}
        </span>
        <span className="flex items-center gap-0.5 rounded-full bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[11px] font-bold text-white">
          <Flame className={cn("h-3 w-3", scoreColor)} />
          <span className="tabular-nums">{clip.score.toFixed(1)}</span>
        </span>
      </div>

      {/* MP4 + duration */}
      <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1">
        <span className="rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
          MP4
        </span>
      </div>

      {/* Bottom gradient + title */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent pt-10 pb-3 px-3">
        <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
          {clip.title}
        </p>
      </div>

      {/* Center play indicator when paused */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-2xl">
            <Play className="h-4 w-4 fill-current translate-x-[1px]" />
          </div>
        </div>
      )}
    </div>
  );
}

function DemoBtn({
  onClick,
  disabled,
  label,
  icon,
  highlight,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border transition-all",
        disabled
          ? "border-border bg-foreground/[0.02] text-muted-foreground/40 cursor-not-allowed"
          : highlight
            ? "border-[color:var(--color-primary)]/50 bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/20 active:scale-95"
            : "border-border bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] hover:border-[color:var(--color-primary)]/40 active:scale-95",
      )}
    >
      {icon}
    </button>
  );
}
