# Contributing to ClipForge

First off — thank you. ClipForge is built by creators, for creators. Every PR, bug report, and idea makes it better.

## Ways to contribute

- **Report bugs** — use the [bug report template](./.github/ISSUE_TEMPLATE/bug_report.yml).
- **Suggest features** — use the [feature request template](./.github/ISSUE_TEMPLATE/feature_request.yml).
- **Improve docs** — typo fixes, clarifications, screenshots welcome.
- **Ship code** — see the workflow below.
- **Share it** — star the repo, tweet about it, link from a tutorial.

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Development setup

```bash
git clone https://github.com/codewithmuh/clipforge.git
cd clipforge
npm install
cp .env.example .env
npm run db:up
npm run db:push
npm run dev
```

You need:

- **Node.js 24+**
- **Docker** (for local Postgres)
- An AI provider key (Anthropic / Gemini / OpenAI) — or use the in-app BYOK panel

## Workflow

1. **Fork** the repo and create a feature branch from `main`:
   ```bash
   git checkout -b feat/short-descriptive-name
   ```
2. **Write code.** Keep changes focused — one concern per PR.
3. **Run checks** before pushing:
   ```bash
   npm run lint
   npm run build
   ```
4. **Commit** using clear, conventional messages:
   - `feat: add capcut export`
   - `fix: handle videos with no transcript`
   - `docs: clarify byok flow`
   - `refactor: extract clip-card`
   - `chore: bump next to 16.2.7`
5. **Open a PR** against `main`. Fill in the PR template. Link any related issues.

## PR checklist

- [ ] Code builds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] No secrets, keys, or `.env` values committed
- [ ] UI changes include before/after screenshots or a Loom
- [ ] New env vars are documented in `.env.example` and the README
- [ ] DB schema changes include a Prisma migration

## Project conventions

- **Read [AGENTS.md](./AGENTS.md) first** — it's the engineering brief and contains conventions Claude / contributors should follow.
- **TypeScript** — no `any` unless justified in a comment.
- **Server actions first**, then route handlers. Stream AI responses where possible.
- **shadcn/ui** for primitives. Compose, don't fork.
- **Tailwind** for styling. No CSS-in-JS, no global stylesheets beyond `globals.css`.
- **Prisma** for DB access — never raw SQL unless there's no alternative.
- **No new dependencies** without a short justification in the PR description.

## Issue triage labels

- `good first issue` — small, well-scoped, great for first-time contributors
- `help wanted` — we'd love a hand on this
- `bug` · `enhancement` · `docs` · `discussion`
- `priority: high` · `priority: low`

## Releases

ClipForge follows [semver](https://semver.org). Maintainers cut releases from `main` after PRs merge.

## Questions

Open a [discussion](https://github.com/codewithmuh/clipforge/discussions) — happy to chat through ideas before you build them.

Thanks for being here. Let's ship something great.
