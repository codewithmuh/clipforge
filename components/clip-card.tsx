"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Play,
  Sparkle,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const TRIGGER_LABEL: Record<ViralClip["emotionalTrigger"], string> = {
  curiosity: "Curiosity",
  controversy: "Controversy",
  emotional_payoff: "Emotional payoff",
  fast_value: "Fast value",
  storytelling_spike: "Storytelling spike",
  humor: "Humor",
  shock: "Shock",
  insight: "Insight",
};

export function ClipCard({
  clip,
  index,
  metadata,
  onExport,
}: {
  clip: ViralClip;
  index: number;
  metadata: VideoMetadata;
  onExport?: (format: ExportFormat, clipIndex: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const duration = Math.max(0, clip.endSec - clip.startSec);
  const watchUrl = `https://www.youtube.com/watch?v=${metadata.id}&t=${Math.floor(
    clip.startSec,
  )}s`;

  function copyHook() {
    navigator.clipboard.writeText(clip.hook);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
    clip.viralityScore >= 80
      ? "text-[color:var(--color-primary)]"
      : clip.viralityScore >= 60
        ? "text-amber-300"
        : "text-foreground/80";

  return (
    <Card className="p-5 sm:p-6 transition-all hover:bg-foreground/[0.05] animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-foreground/5 grid place-items-center text-xs font-mono">
            #{index + 1}
          </div>
          <Badge variant="default" className="font-mono text-[10px]">
            {formatTimestamp(clip.startSec)} → {formatTimestamp(clip.endSec)}
          </Badge>
          <Badge variant="default" className="font-mono text-[10px]">
            {duration}s
          </Badge>
        </div>
        <div className={cn("flex items-center gap-1 font-semibold", scoreColor)}>
          <Flame className="h-4 w-4" />
          <span className="text-lg leading-none tabular-nums">
            {clip.viralityScore}
          </span>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {clip.title}
      </h3>

      <div className="mt-3 rounded-lg border border-border bg-foreground/[0.04] p-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Hook
        </div>
        <p className="text-sm leading-relaxed">{clip.hook}</p>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <span className="text-muted-foreground w-14 shrink-0">Caption</span>
          <span>{clip.caption}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-14 shrink-0">Why</span>
          <span className="text-muted-foreground">{clip.reason}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground w-14 shrink-0">Trigger</span>
          <Badge variant="primary" className="text-[10px]">
            <Sparkle className="h-2.5 w-2.5 mr-1" />
            {TRIGGER_LABEL[clip.emotionalTrigger]}
          </Badge>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={copyHook}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy hook
            </>
          )}
        </Button>
        <a href={watchUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="ghost">
            <Play className="h-3.5 w-3.5" /> Open at start
          </Button>
        </a>
        <div className="relative ml-auto">
          <Button size="sm" onClick={() => setOpenMenu((o) => !o)}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          {openMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setOpenMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-48 rounded-xl border border-border bg-background p-1 shadow-xl">
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
    </Card>
  );
}
