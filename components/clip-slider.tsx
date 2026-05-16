"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClipCard } from "@/components/clip-card";
import type { ViralClip } from "@/lib/types";
import type { VideoMetadata } from "@/lib/youtube-shared";
import type { ExportFormat } from "@/lib/exporters";
import type { RenderedClip as RenderedClipType } from "@/components/dashboard";

const AUTOPLAY_INTERVAL_MS = 6000;

export function ClipSlider({
  clips,
  metadata,
  rendered,
  onExport,
}: {
  clips: ViralClip[];
  metadata: VideoMetadata;
  rendered?: RenderedClipType[];
  onExport?: (format: ExportFormat, clipIndex: number) => void;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const el = scroller.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior });
  }, []);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = (card?.clientWidth ?? 320) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Track scroll position → active card + nav button enable/disable.
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
          Math.abs(c.offsetLeft - scrollLeft - clientWidth / 2 + c.clientWidth / 2),
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
  }, [clips.length]);

  // Auto-advance — pause when hovering, when autoplay toggled off, or when
  // user prefers reduced motion.
  useEffect(() => {
    if (!autoplay || hovering || clips.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }
    const id = window.setInterval(() => {
      const el = scroller.current;
      if (!el) return;
      const atEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        scrollToIndex(0);
      } else {
        scrollByCards(1);
      }
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoplay, hovering, clips.length, scrollByCards, scrollToIndex]);

  // Any user-initiated scroll (drag, wheel, manual nav) doesn't kill autoplay
  // permanently, but if they click prev/next we treat that as "let me drive".
  function handleManualNav(dir: 1 | -1) {
    setAutoplay(false);
    scrollByCards(dir);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs sm:text-sm text-muted-foreground font-mono tabular-nums">
          {active + 1}{" "}
          <span className="text-muted-foreground/60">/ {clips.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <SliderBtn
            onClick={() => setAutoplay((a) => !a)}
            disabled={false}
            label={autoplay ? "Pause auto-advance" : "Resume auto-advance"}
            icon={
              autoplay ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5 translate-x-[1px]" />
              )
            }
            highlight={autoplay && !hovering}
          />
          <SliderBtn
            onClick={() => handleManualNav(-1)}
            disabled={!canPrev}
            label="Previous clip"
            icon={<ChevronLeft className="h-4 w-4" />}
          />
          <SliderBtn
            onClick={() => handleManualNav(1)}
            disabled={!canNext}
            label="Next clip"
            icon={<ChevronRight className="h-4 w-4" />}
          />
        </div>
      </div>

      <div
        ref={scroller}
        className={cn(
          "flex gap-4 overflow-x-auto pb-4",
          "snap-x snap-mandatory scroll-px-4 sm:scroll-px-6",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
        style={{ scrollPaddingInline: "1rem" }}
      >
        {clips.map((clip, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[260px] sm:w-[300px] lg:w-[340px]"
          >
            <ClipCard
              clip={clip}
              index={i}
              metadata={metadata}
              onExport={onExport}
              rendered={rendered?.find((r) => r.clipIndex === i)}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {clips.map((_, i) => (
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

function SliderBtn({
  onClick,
  disabled,
  label,
  icon,
  highlight,
}: {
  onClick: () => void;
  disabled: boolean;
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
