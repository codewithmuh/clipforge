import {
  Sparkles,
  Wand2,
  Scissors,
  Download,
  Bot,
  ShieldCheck,
  Zap,
  Gauge,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { HeroUrlForm } from "@/components/hero-url-form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
            <div className="animate-fade-up [animation-delay:0ms]">
              <Badge variant="primary" className="mx-auto">
                <Sparkles className="h-3 w-3 mr-1" />
                The open-source OpusClip alternative
              </Badge>
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-balance animate-fade-up [animation-delay:80ms]">
              Turn YouTube videos into
              <br />
              <span className="bg-gradient-to-br from-white via-white to-[color:var(--color-primary)] bg-clip-text text-transparent">
                viral shorts in seconds.
              </span>
            </h1>
            <p className="mt-5 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground text-balance animate-fade-up [animation-delay:160ms]">
              Paste any YouTube link. ClipForge finds the 5 most viral moments,
              writes the hooks, and hands you CapCut & Premiere-ready exports.
            </p>
            <div className="mt-10 animate-fade-up [animation-delay:240ms]">
              <HeroUrlForm />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground animate-fade-up [animation-delay:320ms]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                BYOK — keys stay in your browser
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Sub-30s analysis
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" />
                No watermark, no upsell
              </span>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Built for creators who ship every day.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              ClipForge is the brain. You bring the keys, the camera, and the
              editor you already love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature
              icon={<Wand2 className="h-5 w-5" />}
              title="Viral moment detection"
              body="Claude or Gemini reads your full transcript and surfaces the 5 clips with the highest retention potential."
            />
            <Feature
              icon={<Scissors className="h-5 w-5" />}
              title="Hook + caption writer"
              body="Every clip ships with a scroll-stopping hook, on-screen caption, and emphasized keywords."
            />
            <Feature
              icon={<Download className="h-5 w-5" />}
              title="CapCut & Premiere export"
              body="One-click export to CapCut JSON, Premiere markers XML, FCPXML, SRT, VTT, or plain TXT."
            />
            <Feature
              icon={<Bot className="h-5 w-5" />}
              title="Bring your own keys"
              body="Plug in your Anthropic or Gemini key. Stored encrypted in your browser. We never see them."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Open source"
              body="MIT licensed. Host it yourself, fork it, ship a feature, send a PR."
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Insanely fast"
              body="Streaming AI responses, edge-cached transcripts, optimistic UI. Built to feel instant."
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
          <Card className="p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <Step
                n={1}
                title="Paste a YouTube URL"
                body="Any public video with captions enabled. Long-form podcasts, talks, tutorials — anything."
              />
              <Step
                n={2}
                title="Click Find Viral Moments"
                body="ClipForge pulls the transcript, scores every moment, picks the top 5."
              />
              <Step
                n={3}
                title="Export & post"
                body="Open in CapCut or Premiere. Cut, caption, post. Move on with your day."
              />
            </div>
          </Card>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Free. Forever. Bring your own keys.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Hosted AI credits and team workspaces are coming. Until then,
              ClipForge is free and unmetered.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="p-6 transition-colors hover:bg-white/[0.05]">
      <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-[color:var(--color-primary)]">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </Card>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-mono text-[color:var(--color-primary)]">
        STEP {n}
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}
