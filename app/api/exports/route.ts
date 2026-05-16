import { NextResponse } from "next/server";
import { z } from "zod";
import { BackendError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  generationId: z.string(),
  format: z.enum([
    "capcut",
    "premiere",
    "fcpx",
    "srt",
    "vtt",
    "txt",
    "json",
  ]),
  clipIndex: z.number().int().nullish(),
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

  try {
    const data = await backendFetch<{ exportId: number | string }>(
      "/api/clipforge/exports/",
      {
        method: "POST",
        body: JSON.stringify({
          generationId: Number(parsed.generationId),
          format: parsed.format,
          clipIndex: parsed.clipIndex,
        }),
      },
    );
    return NextResponse.json({ exportId: String(data.exportId) });
  } catch (err) {
    if (err instanceof BackendError) {
      // Tracking failures should never block the UX — return success but log.
      console.warn(`[exports] log skipped (${err.status}): ${err.message}`);
      return NextResponse.json({ exportId: null }, { status: 200 });
    }
    return NextResponse.json({ exportId: null }, { status: 200 });
  }
}
