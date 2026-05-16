"use client";

import { useState } from "react";
import { Check, Copy, Star, BookOpen, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const INSTALL_CMD = `git clone https://github.com/codewithmuh/clipforge.git
cd clipforge
npm install
npm run dev`;

export function SelfHost() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="self-host" className="mt-20 sm:mt-28 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Run it yourself
        </div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Clone it. Run it on your laptop in <span className="text-[color:var(--color-primary)]">60 seconds.</span>
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground text-balance">
          MIT-licensed Next.js frontend + Django backend. Bring your own
          Anthropic / Gemini key. Ship to Vercel in one command.
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute top-3 left-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-[10px] font-mono text-muted-foreground">
            ~/clipforge — zsh
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 backdrop-blur px-2.5 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
        <pre className="pt-12 px-5 sm:px-7 pb-6 font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 overflow-x-auto">
          <code>
            <Token type="prompt">$ </Token>
            <Token type="cmd">git clone</Token>{" "}
            <Token type="arg">
              https://github.com/codewithmuh/clipforge.git
            </Token>
            {"\n"}
            <Token type="prompt">$ </Token>
            <Token type="cmd">cd</Token> <Token type="arg">clipforge</Token>
            {"\n"}
            <Token type="prompt">$ </Token>
            <Token type="cmd">npm install</Token>
            {"\n"}
            <Token type="prompt">$ </Token>
            <Token type="cmd">npm run dev</Token>
            {"\n"}
            <Token type="comment">
              # → http://localhost:3000 — paste a YouTube link, hit Get clips.
            </Token>
          </code>
        </pre>
      </Card>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <LinkCard
          href="https://github.com/codewithmuh/clipforge"
          icon={Star}
          title="Star on GitHub"
          body="MIT licensed. PRs welcome."
        />
        <LinkCard
          href="https://github.com/codewithmuh/clipforge#readme"
          icon={BookOpen}
          title="Read the docs"
          body="Setup, env vars, deploy to Vercel."
        />
        <LinkCard
          href="https://github.com/codewithmuh/clipforge/issues"
          icon={MessageCircle}
          title="Open an issue"
          body="Bug report, feature request, anything."
        />
      </div>
    </section>
  );
}

function Token({
  type,
  children,
}: {
  type: "prompt" | "cmd" | "arg" | "comment";
  children: React.ReactNode;
}) {
  const cls =
    type === "prompt"
      ? "text-[color:var(--color-primary)] select-none"
      : type === "cmd"
        ? "text-foreground font-semibold"
        : type === "arg"
          ? "text-muted-foreground"
          : "text-muted-foreground/60";
  return <span className={cls}>{children}</span>;
}

function LinkCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: typeof Star;
  title: string;
  body: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] p-5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground/5 group-hover:bg-[color:var(--color-primary)]/10 group-hover:text-[color:var(--color-primary)] transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{body}</div>
        </div>
      </div>
    </a>
  );
}
