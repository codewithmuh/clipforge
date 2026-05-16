import { NextResponse } from "next/server";
import { z } from "zod";
import { extractYouTubeId, fetchTranscript, fetchVideoMetadata } from "@/lib/youtube";
import { prisma } from "@/lib/db";
import { clientIpFromHeaders, hashIp } from "@/lib/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  url: z.string().min(1),
});

export async function POST(req: Request) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected { url: string }." },
      { status: 400 },
    );
  }

  const id = extractYouTubeId(body.url);
  if (!id) {
    return NextResponse.json(
      { error: "Could not parse a YouTube video ID from that URL." },
      { status: 400 },
    );
  }

  let metadata;
  try {
    metadata = await fetchVideoMetadata(id);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch video metadata. Is the URL public?",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  let transcript;
  try {
    transcript = await fetchTranscript(id);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch transcript. This video may not have captions enabled.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  if (transcript.length === 0) {
    return NextResponse.json(
      { error: "Transcript was empty. This video may not have captions." },
      { status: 422 },
    );
  }

  // Best-effort persist to DB; do not fail the request if DB is down (e.g. user
  // hasn't run `docker compose up -d` yet).
  let submissionId: string | null = null;
  try {
    const ip = clientIpFromHeaders(req.headers);
    const submission = await prisma.submission.create({
      data: {
        youtubeId: id,
        url: metadata.url,
        title: metadata.title,
        channel: metadata.author,
        thumbnail: metadata.thumbnail,
        durationSec: metadata.durationSec,
        language: transcript[0]?.text ? null : null,
        ipHash: hashIp(ip),
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });
    submissionId = submission.id;
  } catch (err) {
    console.warn("[transcript] submission persistence failed:", err);
  }

  return NextResponse.json({
    submissionId,
    metadata,
    transcript,
  });
}
