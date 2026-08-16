# MIIS — bid mockup (Medlingsinstitutet)

Interactive UX/UI prototype for a **public procurement bid**. It is not production
software. It exists to win the award criterion *"Role-based user scenarios and user
interface"* — worth **SEK 1,000,000** of a **SEK 2,500,000** total added value, i.e. 40%
of everything that can be scored. Tender deadline **2026-08-25**; 15-minute oral
presentation at MI in week 35.

Read `docs/00-START-HERE.md` before doing design work. Requirements live in
`docs/requirements/requirements-v2.5-EN.txt` (searchable plain text of the .docx).

## Hard rules

1. **All UI text is in Swedish.** The requirements are an English working translation;
   the target system, the tender and the sketches are Swedish. Never write English
   labels, buttons, headings, placeholders or empty states into the app.
2. **No hard-coded colours.** Use the tokens in `app/globals.css` (`bg-primary`,
   `text-muted-foreground`, `var(--mi-sand-500)`, …). The palette is derived from
   Medlingsinstitutet's identity — see `docs/design-system/`.
3. **WCAG 2.1 AA is a requirement (NFUI-003), not a nice-to-have.** Every interactive
   element needs a visible focus state, a ≥44×44px hit area, a real `<label>`, correct
   heading order and a text alternative. Colour is never the only carrier of meaning —
   the green/red/blue agreement status coding (FR-012) must always have a text label too.
4. **Every view carries its requirement IDs.** Use the `<ReqTag id="FA-007" />`
   component. The evaluators trace requirement → interface; that traceability is a
   large part of why this mockup scores.
5. **AI proposals are never applied automatically (FAI-002).** Anything AI-suggested is
   labelled `AI-FÖRSLAG` and needs an explicit human approve/reject control.
6. **Do not touch the logo.** The MI logo contains a protected Swedish state emblem.
   The `MI` square in the header is a placeholder until MI supplies the official asset.
   Never generate, redraw or "improve" it.
7. **Never rewrite pushed git history** (no force-push, rebase, amend or squash of
   pushed commits). Others review from this history and from deployed builds of it.

## Stack

Next.js 16 App Router (React 19, Turbopack) · TypeScript · Tailwind v4 · shadcn/ui.
`npm run dev` → http://localhost:8080.

```
app/(miis)/**/page.tsx      the screens ← you work here
components/miis/            product components ← and here
components/ui/              vendored shadcn — restyle via tokens, don't edit
app/globals.css             all design tokens — change design here first
lib/domain/                 types + pure rules (status, roles, agreements)
lib/data/                   THE SEAM — every data read goes through here
lib/mock/                   the Swedish sample data
lib/session.ts              which role the current request is
```

### Four structural rules

1. **`lib/domain/` imports nothing.** Types and pure functions only — no React, no
   Next, no data access. It is the part that survives a change of framework or backend.
2. **`lib/data/` is the only place that may touch a database.** Today it reads
   `lib/mock/`; in week 2 it reads Supabase. Nothing else imports either — enforced by
   `no-restricted-imports` in `eslint.config.mjs`, so a violation fails `npm run lint`.
3. **Pages are server components that `await` a `lib/data/` function.** Never fetch
   inside a component. This is what makes the mock→Supabase swap invisible to screens.
4. **Anything interactive is `"use client"` under `components/miis/`,** fed by props.
   `components/miis/primitives.tsx` stays server-side — no hooks in it.

Key files: `AppShell.tsx` (shell + nav, client) · `primitives.tsx` (`Panel`, `Field`,
`Button`, `PageHeading`, `ReqTag`, `StatusDot`, server) · `AiPanel.tsx` (client) ·
`RollVaxlare.tsx` (the demo role switcher) · `Placeholder.tsx` (stub for undesigned
views).

`StatusDot` takes a whole `StatusInfo` (`{kod, farg, etikett}`) rather than a colour, so
FR-012 status can never be rendered as colour alone. Get one from `statusInfo()` or
`avtalStatus()` in `lib/domain/status.ts`.

## Working agreement

- **Prototype data lives in `lib/mock/`, never inside a page.** In Swedish, and
  **realistic**: real Swedish party names (Teknikföretagen, IF Metall, Almega, Unionen,
  Kommunal, Sveriges Lärare, Fremia), plausible agreement names, dates in the
  2026–2027 bargaining round. Fake-looking data reads as an unfinished prototype.
  Relations are id strings (`Medlingsarende.avtalIds` → `Avtal.id`) with nothing
  enforcing them — when you add a record, check the ids it points at actually exist.
- A page that needs data adds a function to `lib/data/`; it does not reach into
  `lib/mock/` itself. Lint enforces this.
- Prefer editing an existing view over adding a new route. The nav in `AppShell.tsx`
  is fixed at 11 items and mirrors the requirement Epics.
- After a UI change, verify it in the browser (`/skiss-test`), don't just assume.
- Keep the branch working — the Vercel deployment builds from it and the CEO reviews
  there.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
