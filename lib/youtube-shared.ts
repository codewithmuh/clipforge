const ID_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(ID_REGEX);
  return match?.[1] ?? null;
}

export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  durationSec: number | null;
  url: string;
}

export interface TranscriptSegment {
  text: string;
  offsetSec: number;
  durationSec: number;
}
