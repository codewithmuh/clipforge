<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# ClipForge — AI YouTube Shorts Editor

## Overview

ClipForge is an AI-powered in-browser tool that converts long-form YouTube videos into viral short-form clips.

Users paste a YouTube URL. The app:
1. Pulls transcript + metadata
2. Uses AI (BYOK Gemini / Claude) to detect viral moments
3. Generates hooks + captions
4. Creates editable clip timestamps
5. Exports JSON for CapCut / Premiere Pro workflows

The product should feel premium, ultra-fast, minimal, creator-first, and extremely easy to use. Think Linear-level polish, OpusClip simplicity, Vercel aesthetics, Framer smoothness.

---

# Core Features

## 1. YouTube URL Import
- Validate URL, fetch metadata + transcript, fallback parser if needed.
- Display title, thumbnail, duration, channel.

## 2. AI Viral Clip Detection
- "Find Viral Moments" returns top 5 clips with timestamps, virality score, emotional trigger, hook, short title, rationale.
- BYOK Claude/Gemini/OpenAI; client-side BYOK OR secure backend proxy.

## 3. Caption Generator
- Animated captions, short subtitle chunks, emoji + emphasis hints, positioning metadata.
- Export JSON / SRT / WebVTT.

## 4. Export System
- CapCut JSON, Premiere markers JSON, Final Cut timestamps, plain TXT summary.

---

# Tech Stack

## Frontend
- Next.js 15 (App Router) + TypeScript
- TailwindCSS + shadcn/ui
- Framer Motion, Zustand, TanStack Query

## Backend
Reuse the existing **codewithmuh-website** Vercel deployment so all submitted URLs / generations flow into one central Postgres DB.

Responsibilities: transcript retrieval, secure AI proxy, analytics, rate limiting, usage tracking, exports, persistence.

## Database
- Production: shared PostgreSQL on codewithmuh-website backend.
- Local dev: Docker Compose Postgres so submitted links are still tracked.

Stores: submitted URLs, clip generations, AI provider used, timestamps, exports, analytics, sessions, API usage.

---

# Docker

```bash
docker compose up -d
```

Required env:
```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

# UI/UX

Dark-mode first. Cinematic, modern, smooth, premium SaaS. References: Vercel, Linear, Arc, OpusClip, Framer. Glassmorphism accents, large type, strong spacing, mobile responsive.

Landing tagline: **"Turn YouTube videos into viral shorts in seconds."**

---

# Pages

- **Landing**: Hero, demo workflow, feature grid, example viral clips, testimonials, pricing, FAQ. CTA = "Paste YouTube URL".
- **Dashboard**: URL input, clip results, transcript viewer, exports, AI settings, BYOK.
- **Clip Results card**: title, virality score, timestamps, generated hook, emotional trigger, copy / export buttons.

---

# AI Prompting

Optimize for retention, curiosity gaps, emotional spikes, storytelling pacing, controversial moments, high-value educational moments. Avoid slow intros, filler, repetition.

---

# Monetization

- Free with BYOK.
- Later: hosted AI credits, team workspaces, export packs, advanced editing, viral analytics.
- Positioning: **"The open-source OpusClip alternative."**

---

# Engineering Rules

Modular, scalable, fully typed, reusable components, clean architecture. ESLint + Prettier + Husky + lint-staged. Prefer server actions, edge-compatible APIs, streaming responses.

---

# Performance

Instant UI feedback, optimistic updates, streaming AI responses, lazy loading, edge caching. App should feel insanely fast.

---

# Security

Never expose private API keys. BYOK keys stored encrypted locally OR session-only. Rate limiting, abuse prevention, input validation.

---

# Success Criteria

A creator pastes a URL → clicks one button → gets 5 viral short ideas → exports to CapCut/Premiere → posts to TikTok/Reels/Shorts. Within minutes. Should feel magical.

---

# Future

Auto B-roll, AI reframing, auto zoom cuts, voice cleanup, TikTok export, Shorts direct upload, creator analytics, trending topic detection, viral scoring engine, team collaboration.
