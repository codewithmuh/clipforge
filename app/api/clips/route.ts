import { NextResponse } from "next/server";
import { z } from "zod";
import { detectViralClips } from "@/lib/ai";
import { BackendError, backendFetch } from "@/lib/backend";
import type { TranscriptSegment, VideoMetadata } from "@/lib/youtube-shared";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  submissionId: z.string().nullish(),
  metadata: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    thumbnail: z.string(),
    durationSec: z.number().nullable(),
    url: z.string(),
  }),
  transcript: z
    .array(
      z.object({
        text: z.string(),
        offsetSec: z.number(),
        durationSec: z.number(),
      }),
    )
    .min(1),
  provider: z.enum(["anthropic", "google"]).default("anthropic"),
  model: z.string().optional(),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof BodySchema>;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      {
        error: "Invalid request body.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 400 },
    );
  }

  const apiKey = (
    parsed.provider === "anthropic"
      ? process.env.ANTHROPIC_API_KEY
      : process.env.GEMINI_API_KEY
  )?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          parsed.provider === "anthropic"
            ? "ANTHROPIC_API_KEY is not set on the server. Add it to .env and restart `npm run dev`."
            : "GEMINI_API_KEY is not set on the server. Add it to .env and restart `npm run dev`.",
      },
      { status: 500 },
    );
  }
  const byok = false;

  let result;
  try {
    result = await detectViralClips({
      metadata: parsed.metadata as VideoMetadata,
      transcript: parsed.transcript as TranscriptSegment[],
      provider: parsed.provider,
      model: parsed.model,
      apiKey,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "AI clip detection failed.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  // Best-effort log to Django backend. We never block the user on this —
  // if the backend is down, the creator still gets their clips.
  let generationId: string | null = null;
  if (parsed.submissionId) {
    try {
      const logged = await backendFetch<{ generationId: number | string }>(
        "/api/clipforge/generations/",
        {
          method: "POST",
          body: JSON.stringify({
            submissionId: Number(parsed.submissionId),
            provider: parsed.provider,
            model: result.model,
            byok,
            promptTokens: result.promptTokens,
            outputTokens: result.outputTokens,
            latencyMs: result.latencyMs,
            clips: result.clips,
          }),
        },
      );
      generationId = String(logged.generationId);
    } catch (err) {
      if (err instanceof BackendError) {
        console.warn(
          `[clips] generation log skipped (${err.status}): ${err.message}`,
        );
      } else {
        console.warn("[clips] generation log skipped:", err);
      }
    }
  }

  return NextResponse.json({
    generationId,
    model: result.model,
    latencyMs: result.latencyMs,
    clips: result.clips,
  });
}
