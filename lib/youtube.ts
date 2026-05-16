import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
import type { TranscriptSegment, VideoMetadata } from "./youtube-shared";

export type { TranscriptSegment, VideoMetadata } from "./youtube-shared";
export { extractYouTubeId } from "./youtube-shared";

export async function fetchVideoMetadata(id: string): Promise<VideoMetadata> {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const oembedRes = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    { cache: "no-store" },
  );
  if (!oembedRes.ok) {
    throw new Error(
      `Failed to fetch video metadata (status ${oembedRes.status}).`,
    );
  }
  const oembed = (await oembedRes.json()) as {
    title: string;
    author_name: string;
    thumbnail_url: string;
  };

  let durationSec: number | null = null;
  try {
    const watchRes = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (ClipForge)" },
      cache: "no-store",
    });
    if (watchRes.ok) {
      const html = await watchRes.text();
      const m = html.match(/"lengthSeconds":"(\d+)"/);
      if (m) durationSec = Number(m[1]);
    }
  } catch {
    // duration is best-effort
  }

  return {
    id,
    title: oembed.title,
    author: oembed.author_name,
    thumbnail: oembed.thumbnail_url,
    durationSec,
    url,
  };
}

export async function fetchTranscript(
  id: string,
): Promise<TranscriptSegment[]> {
  const raw = await YoutubeTranscript.fetchTranscript(id);
  if (raw.length === 0) return [];

  // youtube-transcript returns ms for the srv3 (InnerTube) format and
  // seconds (as floats) for the classic format. Detect and normalize.
  const looksLikeMs = raw.some(
    (seg) => Number.isInteger(seg.offset) && seg.offset > 1000,
  );
  const factor = looksLikeMs ? 1000 : 1;

  return raw.map((seg) => ({
    text: decodeHtmlEntities(seg.text),
    offsetSec: seg.offset / factor,
    durationSec: seg.duration / factor,
  }));
}

function decodeHtmlEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}
