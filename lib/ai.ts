import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  ClipsResponseSchema,
  ProviderModelDefaults,
  type AIProvider,
  type ViralClip,
} from "./types";
import { formatTimestamp } from "./utils";
import type { TranscriptSegment, VideoMetadata } from "./youtube-shared";

export interface DetectViralClipsInput {
  metadata: VideoMetadata;
  transcript: TranscriptSegment[];
  provider: AIProvider;
  model?: string;
  apiKey: string;
}

export interface DetectViralClipsResult {
  clips: ViralClip[];
  model: string;
  latencyMs: number;
  promptTokens?: number;
  outputTokens?: number;
}

const SYSTEM_PROMPT = `You are ClipForge — a viral short-form editor for YouTube creators.

Your job: read a long-form video transcript and surface the 5 most viral 20–60 second moments suitable for YouTube Shorts, TikTok, and Reels.

Optimize for:
- retention spikes
- curiosity gaps and open loops
- emotional spikes (surprise, awe, frustration, humor, payoff)
- storytelling structure (setup → tension → punch)
- self-contained value — a viewer must understand the clip with NO prior context
- controversial, contrarian, or "screenshot-worthy" lines
- high-value educational moments (a tactic, framework, number, or rule)

Avoid:
- slow intros, channel housekeeping, sponsor reads
- filler, repetition, "uhh" loops
- generic statements

Constraints:
- Each clip must be between 18 and 75 seconds long.
- Clips MUST NOT overlap each other.
- Pick clips whose START aligns to a natural sentence start in the transcript.
- Pick clips whose END lands on a satisfying payoff or punchline, not mid-thought.

For each clip return:
- title: a punchy 4–8 word standalone title (NOT a question, NOT clickbait the clip can't deliver)
- hook: the FIRST line a viewer hears — must stop the scroll in <1 second
- caption: a 1-sentence on-screen caption summarizing the payoff
- emphasisWords: 3–8 keywords from the clip worth highlighting on screen
- emotionalTrigger: one of curiosity | controversy | emotional_payoff | fast_value | storytelling_spike | humor | shock | insight
- viralityScore: 0–100 honest estimate of viral potential
- reason: 1 sentence on WHY this clip will perform
- startSec / endSec: integer seconds matching transcript timestamps`;

function buildUserPrompt(
  metadata: VideoMetadata,
  transcript: TranscriptSegment[],
) {
  const lines = transcript.map(
    (s) => `[${formatTimestamp(s.offsetSec)}] ${s.text}`,
  );
  return `Video: ${metadata.title}
Channel: ${metadata.author}
${metadata.durationSec ? `Duration: ${formatTimestamp(metadata.durationSec)}` : ""}

Transcript (timestamp prefix is the absolute start of each line in the video):

${lines.join("\n")}

Return exactly 5 viral clips, ranked by viralityScore descending.`;
}

export async function detectViralClips(
  input: DetectViralClipsInput,
): Promise<DetectViralClipsResult> {
  const { metadata, transcript, provider, apiKey } = input;
  const model = input.model ?? ProviderModelDefaults[provider];

  const start = Date.now();
  const userPrompt = buildUserPrompt(metadata, transcript);

  const languageModel = (() => {
    if (provider === "anthropic") {
      return createAnthropic({ apiKey })(model);
    }
    return createGoogleGenerativeAI({ apiKey })(model);
  })();

  const result = await generateObject({
    model: languageModel,
    schema: ClipsResponseSchema,
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    temperature: 0.4,
  });

  const latencyMs = Date.now() - start;

  const clips = result.object.clips
    .map((c) => ({
      ...c,
      startSec: Math.max(0, Math.round(c.startSec)),
      endSec: Math.max(0, Math.round(c.endSec)),
    }))
    .filter((c) => c.endSec > c.startSec)
    .sort((a, b) => b.viralityScore - a.viralityScore)
    .slice(0, 5);

  return {
    clips,
    model,
    latencyMs,
    promptTokens: result.usage?.inputTokens,
    outputTokens: result.usage?.outputTokens,
  };
}
