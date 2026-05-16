import { NextResponse } from "next/server";
import { z } from "zod";
import { detectViralClips } from "@/lib/ai";
import { prisma } from "@/lib/db";
import type { TranscriptSegment, VideoMetadata } from "@/lib/youtube";

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
  provider: z.enum(["anthropic", "google"]),
  model: z.string().optional(),
  apiKey: z.string().optional(),
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

  const serverKey =
    parsed.provider === "anthropic"
      ? process.env.ANTHROPIC_API_KEY
      : process.env.GEMINI_API_KEY;

  const apiKey = parsed.apiKey?.trim() || serverKey || "";
  const byok = Boolean(parsed.apiKey?.trim());

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          parsed.provider === "anthropic"
            ? "No Anthropic API key provided. Add your key in Settings or set ANTHROPIC_API_KEY on the server."
            : "No Gemini API key provided. Add your key in Settings or set GEMINI_API_KEY on the server.",
      },
      { status: 400 },
    );
  }

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

  let generationId: string | null = null;
  if (parsed.submissionId) {
    try {
      const generation = await prisma.generation.create({
        data: {
          submissionId: parsed.submissionId,
          provider: parsed.provider,
          model: result.model,
          byok,
          promptTokens: result.promptTokens,
          outputTokens: result.outputTokens,
          latencyMs: result.latencyMs,
          clips: result.clips,
        },
      });
      generationId = generation.id;
    } catch (err) {
      console.warn("[clips] generation persistence failed:", err);
    }
  }

  return NextResponse.json({
    generationId,
    model: result.model,
    latencyMs: result.latencyMs,
    clips: result.clips,
  });
}
