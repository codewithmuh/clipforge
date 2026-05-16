# Security Policy

Thanks for helping keep ClipForge and its users safe.

## Supported versions

ClipForge is in active development. Security fixes target the latest `main`
branch and the most recent tagged release.

| Version | Supported |
|---------|-----------|
| `main`  | ✅        |
| latest release | ✅ |
| older releases | ❌ |

## Reporting a vulnerability

**Please do not open public GitHub issues for security problems.**

Instead, report privately so we can investigate and ship a fix before details
become public:

- Email: **codewithmuh@gmail.com** (subject: `ClipForge security report`)
- Or: GitHub's [private vulnerability reporting](https://github.com/codewithmuh/clipforge/security/advisories/new)

Please include:

- A clear description of the issue and its impact
- Steps to reproduce (PoC if possible)
- Affected version / commit
- Your name or handle if you'd like credit

### What to expect

- **Acknowledgement** within 72 hours.
- **Initial assessment** within 7 days.
- **Fix + disclosure plan** coordinated with you. We aim to ship a patch
  within 30 days of confirmation for high-severity issues.
- **Credit** in the release notes and security advisory unless you prefer to
  remain anonymous.

## Scope

In scope:

- The ClipForge web app (`app/`, `components/`, `lib/`)
- API route handlers and server actions
- Prisma schema and DB access patterns
- AI request/response handling (BYOK key handling, proxy logic)
- Dependency vulnerabilities affecting the above

Out of scope:

- Vulnerabilities in third-party services (Vercel, Neon, etc.) — report to them directly
- Social engineering, physical attacks, or denial-of-service
- Issues requiring already-compromised user devices

## Hall of fame

Researchers who report valid issues will be acknowledged here (with permission).
