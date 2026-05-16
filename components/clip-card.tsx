"use client";

import { useState } from "react";
import { Download, Play, Flame, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatTimestamp } from "@/lib/utils";
import type { ViralClip } from "@/lib/types";
import type { VideoMetadata } from "@/lib/youtube-shared";
import { exportClips, type ExportFormat } from "@/lib/exporters";

const EXPORT_OPTIONS: { label: string; value: ExportFormat }[] = [
  { label: "CapCut JSON", value: "capcut" },
  { label: "Premiere XML", value: "premiere" },
  { label: "Final Cut XML", value: "fcpx" },
  { label: "SRT captions", value: "srt" },
  { label: "WebVTT", value: "vtt" },
  { label: "Plain TXT", value: "txt" },
  { label: "JSON", value: "json" },
];

interface RenderedSource {
  url: string;
  layout: "vertical" | "widescreen";
  width: number;
  height: number;
}

export function ClipCard({
  clip,
  index,
  metadata,
  onExport,
  rendered,
}: {
  clip: ViralClip;
  index: number;
  metadata: VideoMetadata;
  onExport?: (format: ExportFormat, clipIndex: number) => void;
  rendered?: RenderedSource;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [vertical, setVertical] = useState(true);

  const hasMp4 = Boolean(rendered);
  const showVertical = hasMp4 ? rendered!.layout === "vertical" : vertical;

  const start = Math.max(0, Math.floor(clip.startSec));
  const end = Math.max(start + 1, Math.ceil(clip.endSec));
  const duration = end - start;
  const watchUrl = `https://www.youtube.com/watch?v=${metadata.id}&t=${start}s`;
  const embedSrc =
    `https://www.youtube.com/embed/${metadata.id}` +
    `?start=${start}&end=${end}&autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const thumbnail = `https://i.ytimg.com/vi/${metadata.id}/maxresdefault.jpg`;

  function handleExport(format: ExportFormat) {
    const payload = exportClips(metadata, [clip], format);
    const blob = new Blob([payload.content], { type: payload.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = payload.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setOpenMenu(false);
    onExport?.(format, index);
  }

  const scoreColor =
    clip.viralityScore >= 8.5
      ? "text-[color:var(--color-primary)]"
      : clip.viralityScore >= 7
        ? "text-amber-500 dark:text-amber-300"
        : "text-foreground/80";

  return (
    <Card className="overflow-hidden transition-all hover:bg-foreground/[0.04] animate-fade-up flex flex-col p-0">
      <div
        className={cn(
          "relative w-full bg-black overflow-hidden",
          showVertical ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        {hasMp4 ? (
          <video
            src={rendered!.url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : playing ? (
          <iframe
            src={embedSrc}
            title={clip.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={cn(
              "absolute inset-0 h-full w-full border-0",
              showVertical && "scale-[2.3] origin-center",
            )}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Play clip ${index + 1}`}
          >
            <img
              src={thumbnail}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105",
                showVertical && "scale-[1.6]",
              )}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://i.ytimg.com/vi/${metadata.id}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
            <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 fill-current translate-x-[1px]" />
            </div>
          </button>
        )}

        {/* Rank badge — big, prominent */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-sm font-bold text-white tabular-nums">
            #{index + 1}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-sm font-bold text-white">
            <Flame className={cn("h-3.5 w-3.5", scoreColor)} />
            <span className="tabular-nums">{clip.viralityScore.toFixed(1)}</span>
            <span className="text-white/50 text-[10px] font-medium">/10</span>
          </span>
          {hasMp4 && (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              MP4
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="pointer-events-none absolute right-3 top-3">
          <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono text-white">
            {duration}s
          </span>
        </div>

        {/* Orientation toggle (only when no MP4 baked yet) */}
        {!hasMp4 && (
          <div className="absolute bottom-3 left-3">
            <button
              type="button"
              onClick={() => setVertical((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black/90 transition-colors"
              aria-label={
                vertical ? "Switch to widescreen" : "Switch to vertical"
              }
            >
              {vertical ? (
                <Monitor className="h-3.5 w-3.5" />
              ) : (
                <Smartphone className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Export menu — bottom right of the video */}
        <div className="absolute bottom-3 right-3">
          <button
            type="button"
            onClick={() => setOpenMenu((o) => !o)}
            className="grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-[color:var(--color-primary)] transition-colors"
            aria-label="Export this clip"
            title="Export"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          {openMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setOpenMenu(false)}
              />
              <div className="absolute right-0 bottom-full mb-2 z-40 w-44 rounded-xl border border-border bg-background p-1 shadow-xl">
                {hasMp4 && (
                  <a
                    href={rendered!.url}
                    download={`clip-${index + 1}.mp4`}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5"
                  >
                    Download MP4
                  </a>
                )}
                {!hasMp4 && (
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5"
                  >
                    Open on YouTube
                  </a>
                )}
                <div className="my-1 h-px bg-border" />
                {EXPORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleExport(opt.value)}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Minimal footer — just the title + timestamp */}
      <div className="px-4 py-3 flex items-center gap-3">
        <h3 className="text-sm font-semibold tracking-tight flex-1 line-clamp-1">
          {clip.title}
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
          {formatTimestamp(start)}–{formatTimestamp(end)}
        </span>
      </div>
    </Card>
  );
}
