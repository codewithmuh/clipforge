"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Download,
  Loader2,
  Settings as SettingsIcon,
  Sparkles,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SettingsPanel } from "@/components/settings-panel";
import { ClipCard } from "@/components/clip-card";
import {
  extractYouTubeId,
  type TranscriptSegment,
  type VideoMetadata,
} from "@/lib/youtube-shared";
import type { ViralClip } from "@/lib/types";
import { useSettings } from "@/lib/store";
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const provider = useSettings((s) => s.provider);
  const apiKey = useSettings((s) => s.apiKeyFor(s.provider));
  const setProvider = useSettings((s) => s.setProvider);

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
          provider,
          apiKey: apiKey || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI clip detection failed.");
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
  const missingKey = !apiKey;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste a YouTube URL, then turn it into 5 viral shorts.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div>

      <Card className="p-4 sm:p-5">
        <form onSubmit={onLoad} className="flex flex-col sm:flex-row gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="flex-1"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={transcriptMutation.isPending || !url.trim()}
            className="sm:w-44"
          >
            {transcriptMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading
              </>
            ) : (
              <>Load video</>
            )}
          </Button>
        </form>
        {transcriptMutation.isError && (
          <ErrorRow message={(transcriptMutation.error as Error).message} />
        )}
      </Card>

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
                  disabled={!canRunClips || missingKey}
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
                  {provider === "anthropic" ? "Claude" : "Gemini"}
                </Badge>
                <button
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  onClick={() =>
                    setProvider(provider === "anthropic" ? "google" : "anthropic")
                  }
                  type="button"
                >
                  switch
                </button>
              </div>
              {missingKey && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Add your{" "}
                  {provider === "anthropic" ? "Anthropic" : "Gemini"} key in{" "}
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="underline"
                  >
                    Settings
                  </button>{" "}
                  to run AI analysis.
                </p>
              )}
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
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                {clipsResult.clips.length} viral moments
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzed by {clipsResult.model} in{" "}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {clipsResult.clips.map((clip, i) => (
              <ClipCard
                key={i}
                clip={clip}
                index={i}
                metadata={transcript!.metadata}
                onExport={logExport}
              />
            ))}
          </div>
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
