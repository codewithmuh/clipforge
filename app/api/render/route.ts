import { NextResponse } from "next/server";
import { z } from "zod";
import { BackendError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";
// Renders can take 60-180s (yt-dlp + ffmpeg). Give the route headroom.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  submissionId: z.string(),
  generationId: z.string().nullish(),
  layout: z.enum(["vertical", "widescreen"]).default("vertical"),
  clips: z
    .array(
      z.object({
        title: z.string().optional(),
        startSec: z.number(),
        endSec: z.number(),
      }),
    )
    .min(1)
    .max(8),
});

interface BackendRenderResponse {
  generationId: number | string;
  layout: "vertical" | "widescreen";
  clips: {
    id: number | string;
    clipIndex: number;
    url: string;
    durationSec: number;
    width: number;
    height: number;
    bytes: number;
    layout: "vertical" | "widescreen";
  }[];
}

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

  try {
    const data = await backendFetch<BackendRenderResponse>(
      "/api/clipforge/render/",
      {
        method: "POST",
        body: JSON.stringify({
          submissionId: Number(parsed.submissionId),
          generationId: parsed.generationId
            ? Number(parsed.generationId)
            : null,
          layout: parsed.layout,
          clips: parsed.clips,
        }),
      },
    );
    return NextResponse.json({
      generationId: String(data.generationId),
      layout: data.layout,
      clips: data.clips.map((c) => ({ ...c, id: String(c.id) })),
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
        error: "Unexpected error rendering clips.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
