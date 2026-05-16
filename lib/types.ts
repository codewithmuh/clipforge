import { z } from "zod";

export const ViralClipSchema = z.object({
  title: z.string().min(2).max(120),
  startSec: z.number().min(0),
  endSec: z.number().min(0),
  hook: z.string().min(2).max(280),
  emotionalTrigger: z.enum([
    "curiosity",
    "controversy",
    "emotional_payoff",
    "fast_value",
    "storytelling_spike",
    "humor",
    "shock",
    "insight",
  ]),
  viralityScore: z.number().min(0).max(10),
  reason: z.string().min(2).max(280),
  caption: z.string().min(2).max(280),
  emphasisWords: z.array(z.string()).max(20).default([]),
});

export type ViralClip = z.infer<typeof ViralClipSchema>;

export const ClipsResponseSchema = z.object({
  clips: z.array(ViralClipSchema).min(1).max(8),
});

export type AIProvider = "anthropic" | "google";

export const ProviderModelDefaults: Record<AIProvider, string> = {
  anthropic: "claude-sonnet-4-6",
  google: "gemini-2.5-flash",
};
