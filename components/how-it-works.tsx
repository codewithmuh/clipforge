import { Link2, Wand2, Clapperboard } from "lucide-react";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    icon: Link2,
    eyebrow: "01 · Paste",
    title: "Drop a YouTube link",
    body: "Any public video with captions. Long podcasts, talks, tutorials — ClipForge pulls the transcript in under 2 seconds.",
  },
  {
    icon: Wand2,
    eyebrow: "02 · Rank",
    title: "AI ranks every moment /10",
    body: "Claude or Gemini reads the full transcript, scores each moment for virality, and surfaces the 3–8 worth posting.",
  },
  {
    icon: Clapperboard,
    eyebrow: "03 · Render",
    title: "Get real 9:16 MP4s",
    body: "yt-dlp + ffmpeg cut and reframe each clip to 1080×1920 — ready for Shorts, TikTok, and Reels. No watermark.",
  },
];

export function HowItWorks() {
  return (
    <section className="mt-20 sm:mt-28">
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          How it works
        </div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Long video in. Viral clips out.
          <br />
          <span className="text-muted-foreground">In one paste.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
        <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {STEPS.map((step, i) => (
          <Card key={step.eyebrow} className="relative p-6 sm:p-7 group">
            <div className="relative flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground/5 border border-border text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)]/10 transition-colors">
                <step.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                {step.eyebrow}
              </span>
            </div>
            <h3 className="mt-5 text-xl sm:text-2xl font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {step.body}
            </p>
            {i < STEPS.length - 1 && (
              <div className="md:hidden mt-6 text-center text-muted-foreground/60 text-xs">
                ↓
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
