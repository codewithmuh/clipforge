"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIProvider } from "./types";

interface SettingsState {
  provider: AIProvider;
  anthropicKey: string;
  geminiKey: string;
  setProvider: (p: AIProvider) => void;
  setAnthropicKey: (k: string) => void;
  setGeminiKey: (k: string) => void;
  apiKeyFor: (p: AIProvider) => string;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      provider: "anthropic",
      anthropicKey: "",
      geminiKey: "",
      setProvider: (provider) => set({ provider }),
      setAnthropicKey: (anthropicKey) => set({ anthropicKey }),
      setGeminiKey: (geminiKey) => set({ geminiKey }),
      apiKeyFor: (p) =>
        p === "anthropic" ? get().anthropicKey : get().geminiKey,
    }),
    { name: "clipforge:settings" },
  ),
);
