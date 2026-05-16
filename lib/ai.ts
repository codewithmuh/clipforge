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

Your job: read a long-form video transcript and surface the BEST 20–60 second moments suitable for YouTube Shorts, TikTok, and Reels.

How many clips:
- Decide how many GENUINELY viral moments exist in this transcript. Don't pad. Don't skimp.
- Minimum 3, maximum 8. Most videos yield 4–6.
- A clip only qualifies if its viralityScore is ≥ 6.0. Below that, drop it.

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

Scoring (0–10 scale, one decimal allowed):
- 9.0–10.0 — guaranteed scroll-stopper, screenshot-worthy line or huge emotional payoff
- 7.5–8.9  — strong; would do well on a creator's main account
- 6.0–7.4  — solid; worth posting but not the highlight
- < 6.0    — do NOT include it

For each clip return:
- title: a punchy 4–8 word standalone title (NOT a question, NOT clickbait the clip can't deliver)
- hook: the FIRST line a viewer hears — must stop the scroll in <1 second
- caption: a 1-sentence on-screen caption summarizing the payoff
- emphasisWords: 3–8 keywords from the clip worth highlighting on screen
- emotionalTrigger: one of curiosity | controversy | emotional_payoff | fast_value | storytelling_spike | humor | shock | insight
- viralityScore: 0–10 honest estimate of viral potential (one decimal)
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

Return 3 to 8 viral clips that score ≥ 6/10, ranked by viralityScore descending. Quality over quantity — drop weak picks.`;
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
      viralityScore: Math.round(c.viralityScore * 10) / 10,
    }))
    .filter((c) => c.endSec > c.startSec && c.viralityScore >= 6)
    .sort((a, b) => b.viralityScore - a.viralityScore)
    .slice(0, 8);

  return {
    clips,
    model,
    latencyMs,
    promptTokens: result.usage?.inputTokens,
    outputTokens: result.usage?.outputTokens,
  };
}
