// Real, baked output from ClipForge running against MKBHD's "Apple Vision Pro
// Impressions!" (OFvXuyITwBI). Picked because the source is 4K (3840×1920),
// which means the 9:16 center-crop is 1080×1920 native — no upscaling, true
// pixel-for-pixel sharpness. Re-generate by running the pipeline on a fresh
// source and copying the MP4s into public/demo/.

export interface DemoClip {
  file: string;
  posterFrame: number;
  rank: number;
  score: number; // 0-10
  title: string;
  hook: string;
  startSec: number;
  endSec: number;
  trigger:
    | "emotional_payoff"
    | "storytelling_spike"
    | "insight"
    | "curiosity"
    | "humor"
    | "shock"
    | "controversy";
}

export const DEMO_SOURCE = {
  title: "Apple Vision Pro Impressions! by Marques Brownlee",
  channel: "Marques Brownlee",
  youtubeId: "OFvXuyITwBI",
  durationSec: 1211, // 20:11
  rankedCount: 6, // total AI returned; we render the top 4
  sourceResolution: "3840×1920 (4K)",
};

export const DEMO_CLIPS: DemoClip[] = [
  {
    file: "/demo/clip-00.mp4",
    posterFrame: 3,
    rank: 1,
    score: 9.2,
    title: "Eye Tracking So Good It Feels Like Magic",
    hook: "The eye tracking is so good — it feels like the headset is reading your mind.",
    startSec: 183,
    endSec: 244,
    trigger: "shock",
  },
  {
    file: "/demo/clip-01.mp4",
    posterFrame: 3,
    rank: 2,
    score: 8.7,
    title: "$3,500 Apple Headset Has No Controllers",
    hook: "$3,500. No controllers. Just your eyes and your fingers.",
    startSec: 39,
    endSec: 104,
    trigger: "curiosity",
  },
  {
    file: "/demo/clip-02.mp4",
    posterFrame: 5,
    rank: 3,
    score: 8.5,
    title: "The Fake Eyes on the Outside Are Creepy",
    hook: "They put fake eyes on the outside — and it's deeply, deeply weird.",
    startSec: 331,
    endSec: 414,
    trigger: "shock",
  },
  {
    file: "/demo/clip-03.mp4",
    posterFrame: 3,
    rank: 4,
    score: 8.1,
    title: "I'd Pay to Watch NBA Courtside in VR",
    hook: "I would pay actual money to watch an NBA game courtside in VR.",
    startSec: 736,
    endSec: 798,
    trigger: "emotional_payoff",
  },
];
