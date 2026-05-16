"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clapperboard,
  Download,
  Link2,
  Loader2,
  Monitor,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipSlider } from "@/components/clip-slider";
import { LiveDemo } from "@/components/live-demo";
import { HowItWorks } from "@/components/how-it-works";
import { BuiltOn } from "@/components/built-on";
import { FeatureRows } from "@/components/feature-rows";
import { SelfHost } from "@/components/self-host";
import { FAQ } from "@/components/faq";
import { BottomCta } from "@/components/bottom-cta";
import {
  extractYouTubeId,
  type TranscriptSegment,
  type VideoMetadata,
} from "@/lib/youtube-shared";
import type { ViralClip } from "@/lib/types";
import { exportClips, type ExportFormat } from "@/lib/exporters";
import { cn, formatDuration, formatTimestamp } from "@/lib/utils";

interface TranscriptResponse {
  submissionId: string | null;
  metadata: VideoMetadata;
  transcript: TranscriptSegment[];
}

interface ClipsResponse {
  generationId: string | null;
  model: string;
  latencyMs: number;
  clips: ViralClip[];
}

export interface RenderedClip {
  id: string;
  clipIndex: number;
  url: string;
  durationSec: number;
  width: number;
  height: number;
  bytes: number;
  layout: "vertical" | "widescreen";
}

interface RenderResponse {
  generationId: string;
  layout: "vertical" | "widescreen";
  clips: RenderedClip[];
}

const BULK_EXPORTS: { label: string; value: ExportFormat }[] = [
  { label: "All clips → CapCut JSON", value: "capcut" },
  { label: "All clips → Premiere XML", value: "premiere" },
  { label: "All clips → Final Cut XML", value: "fcpx" },
  { label: "All clips → SRT", value: "srt" },
  { label: "All clips → TXT", value: "txt" },
  { label: "Everything → JSON", value: "json" },
];

export function Dashboard() {
  const search = useSearchParams();
  const initialV = search.get("v") ?? "";
  const [url, setUrl] = useState(initialV);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [renderLayout, setRenderLayout] = useState<"vertical" | "widescreen">(
    "vertical",
  );

  const transcriptMutation = useMutation({
    mutationFn: async (input: string): Promise<TranscriptResponse> => {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Transcript fetch failed.");
      return data;
    },
  });

  const clipsMutation = useMutation({
    mutationFn: async (): Promise<ClipsResponse> => {
      const t = transcriptMutation.data;
      if (!t) throw new Error("Load a transcript first.");
      const res = await fetch("/api/clips", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: t.submissionId,
          metadata: t.metadata,
          transcript: t.transcript,
          provider: "anthropic",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI clip detection failed.");
      return data;
    },
    onSuccess: () => {
      renderMutation.reset();
    },
  });

  const renderMutation = useMutation({
    mutationFn: async (): Promise<RenderResponse> => {
      const t = transcriptMutation.data;
      const c = clipsMutation.data;
      if (!t || !c) throw new Error("Load a transcript and clips first.");
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId: t.submissionId,
          generationId: c.generationId,
          layout: renderLayout,
          clips: c.clips.map((clip) => ({
            title: clip.title,
            startSec: clip.startSec,
            endSec: clip.endSec,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.detail
            ? `${data.error} — ${data.detail}`
            : (data.error ?? "Render failed."),
        );
      }
      return data;
    },
  });

  useEffect(() => {
    if (initialV && extractYouTubeId(initialV)) {
      transcriptMutation.mutate(initialV);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transcript = transcriptMutation.data;
  const clipsResult = clipsMutation.data;

  const transcriptStats = useMemo(() => {
    if (!transcript) return null;
    const totalSec =
      transcript.transcript.at(-1)?.offsetSec ?? 0 +
      (transcript.transcript.at(-1)?.durationSec ?? 0);
    return {
      segments: transcript.transcript.length,
      seconds: Math.round(totalSec),
    };
  }, [transcript]);

  function onLoad(e: React.FormEvent) {
    e.preventDefault();
    if (!extractYouTubeId(url)) {
      transcriptMutation.reset();
      transcriptMutation.mutate(url);
      return;
    }
    clipsMutation.reset();
    transcriptMutation.mutate(url);
  }

  function logExport(format: ExportFormat, clipIndex?: number) {
    const generationId = clipsResult?.generationId;
    if (!generationId) return;
    fetch("/api/exports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        generationId,
        format,
        clipIndex: clipIndex ?? null,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  function bulkExport(format: ExportFormat) {
    if (!transcript || !clipsResult) return;
    const payload = exportClips(transcript.metadata, clipsResult.clips, format);
    const blob = new Blob([payload.content], { type: payload.mimeType });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = payload.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    setExportMenuOpen(false);
    logExport(format);
  }

  const canRunClips = Boolean(transcript) && !clipsMutation.isPending;
  const isEmpty = !transcript && !transcriptMutation.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
      <div
        className={cn(
          "flex flex-col items-center text-center transition-all",
          isEmpty ? "pt-4 sm:pt-6 pb-4" : "pt-2 pb-6",
        )}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-primary)] animate-pulse" />
          MIT licensed · BYOK · Free forever
        </div>
        {isEmpty ? (
          <h1 className="mt-4 text-[2.25rem] sm:text-6xl font-semibold tracking-[-0.025em] leading-[0.95] text-balance">
            1 long video,{" "}
            <span className="bg-gradient-to-br from-foreground via-foreground to-[color:var(--color-primary)] bg-clip-text text-transparent">
              8 viral clips.
            </span>{" "}
            Free. Forever.
          </h1>
        ) : (
          <h1 className="mt-5 text-2xl sm:text-4xl font-semibold tracking-tight text-balance">
            <span className="bg-gradient-to-br from-foreground via-foreground to-[color:var(--color-primary)] bg-clip-text text-transparent">
              Ready when you are.
            </span>
          </h1>
        )}
        <p
          className={cn(
            "mt-3 max-w-xl text-sm text-muted-foreground text-balance",
            !isEmpty && "sm:text-sm",
          )}
        >
          {isEmpty
            ? "Paste any YouTube link. AI ranks the moments /10, renders real 9:16 MP4s, ready for Shorts, TikTok and Reels."
            : "Loaded. Now find the moments and render the cuts."}
        </p>

        <form
          onSubmit={onLoad}
          className={cn(
            "relative mt-5 w-full max-w-2xl",
            !isEmpty && "mt-5 sm:mt-5",
          )}
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] p-1.5 pl-5 shadow-[0_0_0_1px_rgba(124,92,255,0.0)] focus-within:shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_8px_40px_-8px_rgba(124,92,255,0.35)] transition-shadow">
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
              disabled={transcriptMutation.isPending || !url.trim()}
            >
              {transcriptMutation.isPending ? (
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
          {transcriptMutation.isError && (
            <p className="mt-3 text-sm text-red-500 dark:text-red-300 text-left">
              {(transcriptMutation.error as Error).message}
            </p>
          )}
        </form>

        {isEmpty && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              No watermark
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              ~30s per video
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Claude or Gemini
            </span>
          </div>
        )}
      </div>

      {isEmpty && (
        <>
          <LiveDemo />
          <BuiltOn />
          <FeatureRows />
          <HowItWorks />
          <SelfHost />
          <FAQ />
          <BottomCta />
        </>
      )}

      {transcript && (
        <Card className="mt-4 p-4 sm:p-5 animate-fade-up">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-foreground/10 shrink-0">
              <Image
                src={transcript.metadata.thumbnail}
                alt={transcript.metadata.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate text-base sm:text-lg">
                {transcript.metadata.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {transcript.metadata.author}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {transcript.metadata.durationSec != null && (
                  <Badge>
                    {formatDuration(transcript.metadata.durationSec)}
                  </Badge>
                )}
                {transcriptStats && (
                  <Badge>{transcriptStats.segments} segments</Badge>
                )}
                <Badge variant="success">Transcript ready</Badge>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="lg"
                  onClick={() => clipsMutation.mutate()}
                  disabled={!canRunClips}
                >
                  {clipsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing transcript…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Find viral moments
                    </>
                  )}
                </Button>
                <Badge variant="primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Claude · Sonnet 4.6
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {clipsMutation.isError && (
        <Card className="mt-4 p-4 sm:p-5">
          <ErrorRow message={(clipsMutation.error as Error).message} />
        </Card>
      )}

      {clipsMutation.isPending && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonClip key={i} delayMs={i * 80} />
          ))}
        </div>
      )}

      {clipsResult && (
        <>
          <div className="mt-10 mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                {clipsResult.clips.length} viral moment
                {clipsResult.clips.length === 1 ? "" : "s"} found
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Best {Math.max(...clipsResult.clips.map((c) => c.viralityScore)).toFixed(1)}
                /10
                {" · "}
                avg{" "}
                {(
                  clipsResult.clips.reduce(
                    (sum, c) => sum + c.viralityScore,
                    0,
                  ) / clipsResult.clips.length
                ).toFixed(1)}
                /10 · total runtime{" "}
                {formatDuration(
                  clipsResult.clips.reduce(
                    (sum, c) => sum + (c.endSec - c.startSec),
                    0,
                  ),
                )}
                {" · "}analyzed by {clipsResult.model} in{" "}
                {(clipsResult.latencyMs / 1000).toFixed(1)}s
              </p>
            </div>
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setExportMenuOpen((o) => !o)}
              >
                <Download className="h-4 w-4" /> Export all
              </Button>
              {exportMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setExportMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-40 w-60 rounded-xl border border-border bg-background p-1 shadow-xl">
                    {BULK_EXPORTS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => bulkExport(o.value)}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <ClipSlider
            clips={clipsResult.clips}
            metadata={transcript!.metadata}
            rendered={renderMutation.data?.clips}
            onExport={logExport}
          />

          <Card className="mt-8 mb-4 p-4 sm:p-5">
            <h3 className="text-sm font-semibold mb-3">Ranked moments</h3>
            <ol className="space-y-1.5">
              {clipsResult.clips.map((clip, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 hover:bg-foreground/[0.03] transition-colors"
                >
                  <span className="font-mono text-xs text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums w-12",
                      clip.viralityScore >= 8.5
                        ? "text-[color:var(--color-primary)]"
                        : clip.viralityScore >= 7
                          ? "text-amber-600 dark:text-amber-300"
                          : "text-foreground/70",
                    )}
                  >
                    {clip.viralityScore.toFixed(1)}
                    <span className="text-muted-foreground text-[10px] ml-0.5">
                      /10
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground w-32">
                    {formatTimestamp(clip.startSec)} → {formatTimestamp(clip.endSec)}
                    <span className="ml-1 text-muted-foreground/60">
                      ({Math.round(clip.endSec - clip.startSec)}s)
                    </span>
                  </span>
                  <span className="truncate flex-1">{clip.title}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="mt-2 mb-4 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clapperboard className="h-4 w-4 text-[color:var(--color-primary)]" />
                  Render real MP4 clips
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Downloads the source video, cuts each clip with ffmpeg,
                  and reframes for vertical Shorts. Takes ~30–90s.
                </p>
              </div>
              <div className="inline-flex rounded-xl border border-border bg-foreground/5 p-0.5">
                <button
                  type="button"
                  onClick={() => setRenderLayout("vertical")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    renderLayout === "vertical"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" /> 9:16
                </button>
                <button
                  type="button"
                  onClick={() => setRenderLayout("widescreen")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    renderLayout === "widescreen"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" /> 16:9
                </button>
              </div>
              <Button
                onClick={() => renderMutation.mutate()}
                disabled={renderMutation.isPending}
              >
                {renderMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rendering…
                  </>
                ) : (
                  <>
                    <Clapperboard className="h-4 w-4" />
                    {renderMutation.data ? "Re-render" : "Render clips"}
                  </>
                )}
              </Button>
            </div>
            {renderMutation.isError && (
              <ErrorRow
                message={(renderMutation.error as Error).message}
              />
            )}
            {renderMutation.data && !renderMutation.isPending && (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">
                ✓ {renderMutation.data.clips.length} MP4
                {renderMutation.data.clips.length === 1 ? "" : "s"} ready —{" "}
                {renderMutation.data.layout === "vertical" ? "1080×1920" : "16:9"}
                . Cards now play the real cut.
              </p>
            )}
          </Card>

        </>
      )}

      {transcript && !clipsResult && !clipsMutation.isPending && (
        <Card className="mt-6 p-5 sm:p-6">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--color-primary)]" />
            Transcript preview
          </h3>
          <div className="mt-3 max-h-72 overflow-y-auto text-xs leading-relaxed font-mono space-y-1 text-muted-foreground">
            {transcript.transcript.slice(0, 200).map((seg, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[color:var(--color-primary)]/70 shrink-0 w-12">
                  {formatTimestamp(seg.offsetSec)}
                </span>
                <span>{seg.text}</span>
              </div>
            ))}
            {transcript.transcript.length > 200 && (
              <p className="pt-2 text-muted-foreground">
                + {transcript.transcript.length - 200} more segments…
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function ErrorRow({ message }: { message: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-300">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function SkeletonClip({ delayMs }: { delayMs: number }) {
  return (
    <Card
      className={cn("p-5 animate-fade-up")}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-foreground/5 animate-pulse" />
        <div className="h-5 w-10 rounded bg-foreground/5 animate-pulse" />
      </div>
      <div className="mt-4 h-6 w-3/4 rounded bg-foreground/5 animate-pulse" />
      <div className="mt-3 h-20 rounded-lg bg-foreground/[0.03] animate-pulse" />
      <div className="mt-3 h-4 w-full rounded bg-foreground/5 animate-pulse" />
      <div className="mt-2 h-4 w-2/3 rounded bg-foreground/5 animate-pulse" />
    </Card>
  );
}
