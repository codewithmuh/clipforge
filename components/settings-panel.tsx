"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    provider,
    anthropicKey,
    geminiKey,
    setProvider,
    setAnthropicKey,
    setGeminiKey,
  } = useSettings();
  const [revealAnth, setRevealAnth] = useState(false);
  const [revealGem, setRevealGem] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-[#0b0b10] border-l border-white/10 transition-transform duration-300 flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[color:var(--color-primary)]" />
            <h2 className="font-semibold">Settings</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <h3 className="text-sm font-medium mb-2">AI provider</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Choose which model analyzes your transcript.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ProviderBtn
                active={provider === "anthropic"}
                onClick={() => setProvider("anthropic")}
                title="Claude"
                sub="Sonnet 4.6"
              />
              <ProviderBtn
                active={provider === "google"}
                onClick={() => setProvider("google")}
                title="Gemini"
                sub="2.5 Flash"
              />
            </div>
          </section>

          <section className="space-y-2">
            <label
              htmlFor="anthropic-key"
              className="text-sm font-medium flex items-center justify-between"
            >
              Anthropic API key
              <button
                onClick={() => setRevealAnth((r) => !r)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {revealAnth ? (
                  <>
                    <EyeOff className="h-3 w-3" /> hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" /> show
                  </>
                )}
              </button>
            </label>
            <Input
              id="anthropic-key"
              type={revealAnth ? "text" : "password"}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-…"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Get one at{" "}
              <a
                className="underline hover:text-foreground"
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
              >
                console.anthropic.com
              </a>
              . Stored in this browser only.
            </p>
          </section>

          <section className="space-y-2">
            <label
              htmlFor="gemini-key"
              className="text-sm font-medium flex items-center justify-between"
            >
              Gemini API key
              <button
                onClick={() => setRevealGem((r) => !r)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {revealGem ? (
                  <>
                    <EyeOff className="h-3 w-3" /> hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" /> show
                  </>
                )}
              </button>
            </label>
            <Input
              id="gemini-key"
              type={revealGem ? "text" : "password"}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIza…"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Get one at{" "}
              <a
                className="underline hover:text-foreground"
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
              >
                aistudio.google.com
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="p-5 border-t border-white/8">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </footer>
      </aside>
    </>
  );
}

function ProviderBtn({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        active
          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
      )}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}
