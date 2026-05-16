import { NextResponse } from "next/server";
import { z } from "zod";
import { BackendError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  url: z.string().min(1),
});

interface BackendTranscriptResponse {
  submissionId: number | string;
  metadata: {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    durationSec: number | null;
    url: string;
  };
  transcript: {
    text: string;
    offsetSec: number;
    durationSec: number;
  }[];
}

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

  // Forward X-Forwarded-For so the backend records the original client IP
  // (hashed) rather than the Next.js server's IP.
  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    undefined;

  try {
    const data = await backendFetch<BackendTranscriptResponse>(
      "/api/clipforge/transcript/",
      {
        method: "POST",
        body: JSON.stringify({ url: body.url }),
        headers: forwardedFor
          ? { "x-forwarded-for": forwardedFor }
          : undefined,
      },
    );
    return NextResponse.json({
      submissionId: String(data.submissionId),
      metadata: data.metadata,
      transcript: data.transcript,
    });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json(
        { error: err.message, detail: err.detail },
        { status: err.status >= 400 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      {
        error: "Unexpected error fetching transcript.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
