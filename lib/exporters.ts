import { formatTimestamp } from "./utils";
import type { ViralClip } from "./types";
import type { VideoMetadata } from "./youtube-shared";

export type ExportFormat =
  | "capcut"
  | "premiere"
  | "fcpx"
  | "srt"
  | "vtt"
  | "txt"
  | "json";

export interface ExportPayload {
  format: ExportFormat;
  filename: string;
  mimeType: string;
  content: string;
}

function toSrtTime(seconds: number) {
  const total = Math.max(0, seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const ms = Math.floor((total - Math.floor(total)) * 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}

function toVttTime(seconds: number) {
  return toSrtTime(seconds).replace(",", ".");
}

function safeBase(metadata: VideoMetadata) {
  return metadata.title.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || metadata.id;
}

export function exportClips(
  metadata: VideoMetadata,
  clips: ViralClip[],
  format: ExportFormat,
): ExportPayload {
  const base = safeBase(metadata);

  switch (format) {
    case "capcut": {
      const payload = {
        format: "clipforge.capcut.v1",
        source: {
          platform: "youtube",
          videoId: metadata.id,
          url: metadata.url,
          title: metadata.title,
          channel: metadata.author,
        },
        clips: clips.map((c, i) => ({
          index: i + 1,
          title: c.title,
          hook: c.hook,
          caption: c.caption,
          emphasisWords: c.emphasisWords,
          inSec: c.startSec,
          outSec: c.endSec,
          durationSec: c.endSec - c.startSec,
          viralityScore: c.viralityScore,
          emotionalTrigger: c.emotionalTrigger,
        })),
      };
      return {
        format,
        filename: `${base}-capcut.json`,
        mimeType: "application/json",
        content: JSON.stringify(payload, null, 2),
      };
    }

    case "premiere": {
      // Adobe Premiere supports XMEML-style sequence markers via XML.
      // We emit a simple, importable marker XML the user can drop on a sequence.
      const markers = clips
        .map(
          (c, i) => `    <marker>
      <name>${escapeXml(`#${i + 1} ${c.title}`)}</name>
      <comment>${escapeXml(c.hook + " — " + c.reason)}</comment>
      <in>${Math.round(c.startSec * 30)}</in>
      <out>${Math.round(c.endSec * 30)}</out>
    </marker>`,
        )
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<premiere-markers source="${escapeXml(metadata.url)}" fps="30">
  <title>${escapeXml(metadata.title)}</title>
  <markers>
${markers}
  </markers>
</premiere-markers>
`;
      return {
        format,
        filename: `${base}-premiere-markers.xml`,
        mimeType: "application/xml",
        content: xml,
      };
    }

    case "fcpx": {
      // Final Cut Pro XML (FCPXML) markers list — minimal, importable on a clip.
      const markers = clips
        .map(
          (c, i) =>
            `      <marker start="${c.startSec.toFixed(2)}s" duration="${(c.endSec - c.startSec).toFixed(2)}s" value="${escapeXml(`#${i + 1} ${c.title}`)}"/>`,
        )
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <event name="${escapeXml(metadata.title)}">
    <clip name="${escapeXml(metadata.title)}" duration="${
      metadata.durationSec ?? 0
    }s">
${markers}
    </clip>
  </event>
</fcpxml>
`;
      return {
        format,
        filename: `${base}-fcpx.fcpxml`,
        mimeType: "application/xml",
        content: xml,
      };
    }

    case "srt": {
      const lines = clips.map(
        (c, i) =>
          `${i + 1}\n${toSrtTime(c.startSec)} --> ${toSrtTime(c.endSec)}\n${c.caption}\n`,
      );
      return {
        format,
        filename: `${base}-captions.srt`,
        mimeType: "application/x-subrip",
        content: lines.join("\n"),
      };
    }

    case "vtt": {
      const lines = clips.map(
        (c, i) =>
          `${i + 1}\n${toVttTime(c.startSec)} --> ${toVttTime(c.endSec)}\n${c.caption}\n`,
      );
      return {
        format,
        filename: `${base}-captions.vtt`,
        mimeType: "text/vtt",
        content: "WEBVTT\n\n" + lines.join("\n"),
      };
    }

    case "txt": {
      const body = clips
        .map(
          (c, i) =>
            `#${i + 1}  [${formatTimestamp(c.startSec)} → ${formatTimestamp(
              c.endSec,
            )}]  ★${c.viralityScore}\n` +
            `   Title : ${c.title}\n` +
            `   Hook  : ${c.hook}\n` +
            `   Why   : ${c.reason}\n` +
            `   Trig  : ${c.emotionalTrigger}\n`,
        )
        .join("\n");
      return {
        format,
        filename: `${base}-clips.txt`,
        mimeType: "text/plain",
        content: `${metadata.title} — by ${metadata.author}\n${metadata.url}\n\n${body}`,
      };
    }

    case "json":
    default: {
      const payload = {
        format: "clipforge.v1",
        source: metadata,
        clips,
      };
      return {
        format: "json",
        filename: `${base}-clipforge.json`,
        mimeType: "application/json",
        content: JSON.stringify(payload, null, 2),
      };
    }
  }
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
