---
description: Design and implement a MIIS view end to end — requirements, layout, Swedish copy, code, screenshot
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

- The route file in `src/routes/`, replacing the `PlaceholderPage` stub if there is one.
- Compose from the existing primitives in `src/components/miis/AppShell.tsx`
  (`Panel`, `Field`, `Button`, `PageHeading`, `ReqTag`, `StatusDot`) and shadcn/ui in
  `src/components/ui/`. Add a new primitive to `AppShell.tsx` only if it will be reused.
- Realistic Swedish sample data: real party names (Teknikföretagen, IF Metall, Almega,
  Unionen, Kommunal, Sveriges Lärare, Fremia, Svenskt Näringsliv), plausible agreement
  names, dates in the 2026–2027 bargaining round. No `Lorem ipsum`, no "Example AB".
- `<ReqTag id="…" />` on the page heading and on each panel that realises a requirement.
- Set `head.meta` title and description in Swedish, matching the pattern in the
  existing routes.
- Design the states, not just the happy path: empty, incomplete registration, error,
  and — where AI is involved — the proposal-rejected state.
- Set the right user and role on `<AppShell user role>` for the scenario.

## 4. Verify

Confirm the dev server is running (`npm run dev`, http://localhost:8080), then open the
route in a browser, screenshot it at 1440px wide, and check at 1280px that nothing
breaks. Show me the screenshot.

## 5. Report

- What you built, section by section
- Which Feature IDs it now covers, and which named fields from the spec you left out
- Anything you had to invent because the spec is silent — flag these clearly so I can
  check them against the customer's reality
