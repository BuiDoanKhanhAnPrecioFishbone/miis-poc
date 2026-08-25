---
description: Design and build a MIIS screen end to end — requirements, layout, Swedish copy, code, screenshot
argument-hint: "partstraffar | medlare | avtal"
---

Design and build the MIIS view for: **$ARGUMENTS**

Follow `CLAUDE.md` throughout — Swedish UI text, MI tokens only, WCAG 2.1 AA,
requirement tags, AI proposals always human-approved.

## 1. Understand before designing

Read `docs/requirements/requirements-v2.5-EN.txt` for the scenario and its feature IDs,
`docs/03-screen-backlog.md` for why this screen matters, and `docs/04-ux-brief.md` for
what earns points. Read `docs/sketches/` if one covers this area.

## 2. Propose before building

Describe the layout in a few sentences and list the sections, then say what you are
*not* including and why. If there is a genuine fork in the design, show me both and
recommend one. Wait for my go-ahead only if the choice is significant; otherwise
proceed.

## 3. Build

- `app/(miis)/<route>/page.tsx`. Every route is built; there are no stubs left to replace.
  It is a **server component**: `await` the data it needs from `lib/data/`, then render.
- Compose from `components/miis/primitives.tsx` (`Panel`, `Field`, `Button`,
  `PageHeading`, `ReqTag`, `StatusDot`) and shadcn/ui in `components/ui/`. Add a new
  primitive to `primitives.tsx` only if it will be reused. Anything needing state or
  event handlers is a separate `"use client"` component under `components/miis/`.
- **Sample data goes in `lib/mock/` and is exposed through a `lib/data/` function —
  never inline in the page.** Add types to `lib/domain/` if the concept is new. Lint
  fails if a page imports `lib/mock/` directly.
- Realistic Swedish sample data: real party names (Teknikföretagen, IF Metall, Almega,
  Unionen, Kommunal, Sveriges Lärare, Fremia, Svenskt Näringsliv), plausible agreement
  names, dates in the 2026–2027 bargaining round. No `Lorem ipsum`, no "Example AB".
  Check that ids you reference (`agreementIds`, party ids) resolve — the build fails
  otherwise. Verify the screen in all three demo datasets (tomt / normal / högtryck),
  including its empty state.
- `<ReqTag id="…" />` on the page heading and on each panel that realises a requirement.
- `export const metadata` with a Swedish title and description, matching the pattern in
  the existing pages. For a dynamic route use `generateMetadata`.
- Use `statusInfo()` / `avtalStatus()` from `lib/domain/status.ts` for FR-012 colour
  coding — never a bare colour string.
- Design the states, not just the happy path: empty, incomplete registration, error,
  and — where AI is involved — the proposal-rejected state.
- Set the scenario's role via `roleInfo("…")` and pass `dataset={await activeDataset()}`
  to `<AppShell>`.
- **Identifiers in English, content in Swedish** — types, functions and variables use
  English names; everything the user reads is Swedish.

## 4. Verify

Confirm the dev server is running (`npm run dev`, http://localhost:8080), then open the
route in a browser, screenshot it at 1440px wide, and check at 1280px that nothing
breaks. Show me the screenshot.

## 5. Report

- What you built, section by section
- Which Feature IDs it now covers, and which named fields from the spec you left out
- Anything you had to invent because the spec is silent — flag these clearly so I can
  check them against the customer's reality
