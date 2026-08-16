# MIIS — UX/UI prototype

Interactive prototype of **MIIS**, the Swedish National Mediation Office's
(Medlingsinstitutet) information system for collective agreements and mediation. Built
for a public procurement bid, where the UX/UI is 40% of the scorable added value.

Not production software. Synthetic data only.

## Run it

```bash
npm install
npm run dev        # http://localhost:8080
```

Requires Node.js 22 or newer.

```bash
npm run build      # production build, includes TypeScript
npm run lint       # includes the architecture guards
```

## Where things are

```
app/(miis)/**/page.tsx   the 12 screens
components/miis/         product components (AppShell, primitives, AiPanel)
components/ui/           vendored shadcn/ui — restyle via tokens, don't edit
app/globals.css          design tokens
lib/domain/              types + pure rules — imports nothing
lib/data/                the seam: every data read goes through here
lib/mock/                Swedish sample data
docs/                    requirements, workflow, backlog, design system
```

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · shadcn/ui.

## Start here

- **[`docs/00-START-HERE.md`](docs/00-START-HERE.md)** — the designer's guide and daily
  workflow
- [`CLAUDE.md`](CLAUDE.md) — project rules, loaded automatically by Claude Code
- [`docs/03-screen-backlog.md`](docs/03-screen-backlog.md) — what's built, what's next
- [`docs/06-migration-plan.md`](docs/06-migration-plan.md) — architecture and the
  week-2 Supabase plan

## Two rules that are enforced, not just documented

`npm run lint` fails if either is broken:

1. `lib/domain/` imports nothing — no React, no Next, no data access.
2. Only `lib/data/` may import a database client or `lib/mock/`.

That is what keeps the swap from mock data to a real backend from reaching any screen.
