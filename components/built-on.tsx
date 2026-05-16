export function BuiltOn() {
  const tools = [
    "Next.js",
    "Anthropic Claude",
    "Google Gemini",
    "yt-dlp",
    "ffmpeg",
    "Django",
    "Vercel",
    "shadcn",
    "Postgres",
  ];

  // Duplicate for seamless marquee loop.
  const row = [...tools, ...tools];

  return (
    <section className="mt-14 sm:mt-20">
      <p className="text-center text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-6">
        Built honestly, on open tools
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-12 sm:gap-16 animate-marquee hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground/40 hover:text-foreground/80 transition-colors whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
