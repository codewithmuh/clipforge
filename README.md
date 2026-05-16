<div align="center">

# ClipForge

**Open-source AI video clipper.**
Turn long YouTube videos into viral shorts in seconds — powered by your own AI key.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square)](./CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/codewithmuh/clipforge?style=flat-square&color=f59e0b)](https://github.com/codewithmuh/clipforge/stargazers)

Live app (coming soon): [clipforge.codewithmuh.com](https://clipforge.codewithmuh.com) · [Report bug](https://github.com/codewithmuh/clipforge/issues/new?template=bug_report.yml) · [Request feature](https://github.com/codewithmuh/clipforge/issues/new?template=feature_request.yml) · [Discussions](https://github.com/codewithmuh/clipforge/discussions)

</div>

---
<img width="1721" height="958" alt="Screenshot 2026-05-16 at 9 32 35 PM" src="https://github.com/user-attachments/assets/7e3ca1b4-ecb1-4aab-b3eb-ef4d9500bcec" />

## What is ClipForge?

ClipForge is an AI-powered, in-browser tool that converts long-form YouTube videos into viral short-form clips for TikTok, Reels, and Shorts.

Paste a YouTube URL → ClipForge fetches the transcript, asks an AI to find the **5 most viral moments**, generates hooks + captions, and exports clip metadata ready for CapCut, Premiere Pro, Final Cut, or your editor of choice.

**Bring your own key.** Use Anthropic Claude, Google Gemini, or OpenAI — keys stay in your browser or pass through a secure server proxy you control.

> Built for creators who want viral-clip results without the SaaS bill.

---
<img width="1721" height="958" alt="Screenshot 2026-05-16 at 9 32 35 PM" src="https://github.com/user-attachments/assets/74316343-f7bd-4186-81a4-77b4400a8823" />
<img width="1721" height="958" alt="Screenshot 2026-05-16 at 9 32 35 PM" src="https://github.com/user-attachments/assets/b612cd70-d342-43be-a546-4176f3a41b85" />

## Why ClipForge

- **AI-first viral detection** — ranks moments by hook strength, emotional spike, curiosity gap, and retention pacing.
- **BYOK** — Anthropic, Gemini, OpenAI. Your keys, your costs, your control.
- **Editor-ready exports** — CapCut JSON, Premiere markers, Final Cut timestamps, SRT/VTT captions, plain TXT.
- **Self-hostable** — single Next.js app + Postgres. Deploy to Vercel in one click or run locally with Docker.
- **Premium UI** — dark-mode first, Linear-grade polish, ultra-fast, mobile-responsive.
- **Open source** — MIT licensed. Fork it, ship it, charge for it.

---

## Features

| | |
|---|---|
| **YouTube URL Import** | Validates URL, pulls transcript + metadata (title, thumbnail, duration, channel). |
| **AI Viral Clip Detection** | Top 5 clips with timestamps, virality score, emotional trigger, generated hook, rationale. |
| **Caption Generator** | Animated-caption metadata, short chunks, emphasis + emoji hints, positioning. Export as JSON / SRT / WebVTT. |
| **Multi-format Export** | CapCut JSON · Premiere markers · Final Cut timestamps · SRT · VTT · Plain text. |
| **BYOK or Proxy** | Use Claude / Gemini / OpenAI directly from the browser, or route through your own backend. |
| **Vercel AI Gateway support** | Optional unified gateway for fallbacks, observability, and zero data retention. |
| **Submission tracking** | Postgres-backed log of URLs, generations, exports, and usage for analytics. |

---

## Tech Stack

**Frontend** — Next.js 16 (App Router), React 19, TypeScript, TailwindCSS 4, shadcn/ui, Framer Motion, Zustand, TanStack Query

**AI** — Vercel AI SDK v6 · `@ai-sdk/anthropic` · `@ai-sdk/google` · OpenAI · Vercel AI Gateway (optional)

**Backend** — Next.js Server Actions + Route Handlers on Fluid Compute, Prisma ORM

**Database** — PostgreSQL 16 (Docker locally, Neon/Vercel Postgres marketplace in prod)

**Deploy** — Vercel (one click) or self-host anywhere Node.js runs

---

## Quick start

### 1. Clone

```bash
git clone https://github.com/codewithmuh/clipforge.git
cd clipforge
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Local Postgres (matches docker-compose.yml)
DATABASE_URL="postgresql://clipforge:clipforge@localhost:5433/clipforge?schema=public"

# Public base URL of the frontend
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional — users can BYOK from the UI instead
ANTHROPIC_API_KEY=""
GEMINI_API_KEY=""
OPENAI_API_KEY=""

# Optional — Vercel AI Gateway
AI_GATEWAY_API_KEY=""
```

### 3. Start Postgres

```bash
npm run db:up
npm run db:push
```

### 4. Run the app

```bash
npm run dev
```

Open <http://localhost:3000> and paste any YouTube URL.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run db:up` | Start local Postgres via Docker |
| `npm run db:down` | Stop local Postgres |
| `npm run db:push` | Push Prisma schema to DB (no migration) |
| `npm run db:migrate` | Create + apply a new Prisma migration |
| `npm run db:studio` | Open Prisma Studio |

---

## Deployment

### Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/codewithmuh/clipforge)

1. Click the button above.
2. Add a Postgres database from the **Vercel Marketplace** (Neon or Supabase) — `DATABASE_URL` is auto-wired.
3. (Optional) Add API keys for `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `OPENAI_API_KEY`, or leave blank for BYOK-only mode.
4. Deploy.

### Self-host

Any platform that runs Node.js 24+ and Postgres 16. Build with `npm run build`, run `npm run start`.

---

## BYOK — bring your own key

ClipForge never stores user-supplied API keys server-side. Keys entered in the **Settings** panel are kept in `localStorage` (or memory) and sent only with that request.

Supported providers:

- **Anthropic** — `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`
- **Google** — `gemini-2.0-flash`, `gemini-2.0-pro`
- **OpenAI** — `gpt-4o`, `gpt-4o-mini`
- **Vercel AI Gateway** — any model via the gateway, with fallbacks

---

## Project structure

```
clipforge/
├── app/                  # Next.js App Router
│   ├── api/              # Route handlers (transcript, clips)
│   ├── app/              # Dashboard (/app)
│   ├── layout.tsx        # Root layout (theme, providers)
│   └── page.tsx          # Landing page
├── components/           # UI — dashboard, hero, clip cards, settings
│   └── ui/               # shadcn/ui primitives
├── lib/                  # AI client, DB, exporters, YouTube, store
├── prisma/               # schema.prisma — Submission / Generation / ExportEvent
├── public/               # Static assets
├── docker-compose.yml    # Local Postgres
└── AGENTS.md             # Engineering brief (read before contributing)
```

---

## Roadmap

- [ ] Hosted app at [clipforge.codewithmuh.com](https://clipforge.codewithmuh.com) (in progress)
- [ ] Auto B-roll suggestions
- [ ] AI reframing (16:9 → 9:16) preview
- [ ] Auto zoom-cut markers
- [ ] Direct upload to TikTok / Reels / Shorts
- [ ] Viral scoring engine v2 (per-platform tuning)
- [ ] Creator analytics dashboard
- [ ] Team workspaces
- [ ] Trending-topic detection

Have an idea? [Open a feature request.](https://github.com/codewithmuh/clipforge/issues/new?template=feature_request.yml)

---

## Contributing

PRs are welcome and appreciated. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) first.

Good first issues are tagged [`good first issue`](https://github.com/codewithmuh/clipforge/labels/good%20first%20issue).

---

## Security

Found a vulnerability? Please **don't** open a public issue. See [SECURITY.md](./SECURITY.md) for responsible-disclosure instructions.

---

## License

[MIT](./LICENSE) © [codewithmuh](https://github.com/codewithmuh) and contributors.

---

<div align="center">

**If ClipForge saves you time, star the repo — it helps a lot.**

Built by [@codewithmuh](https://github.com/codewithmuh) · [YouTube](https://youtube.com/@codewithmuh) · [X / Twitter](https://x.com/codewithmuh)

</div>
