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
   labels, buttons, headings, placeholders or empty states into `src/`.
2. **No hard-coded colours.** Use the tokens in `src/styles.css` (`bg-primary`,
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
   pushed commits). This repo syncs with Lovable and history rewrites destroy the
   CEO's project history there. See `AGENTS.md`.

## Stack

TanStack Start (SSR React 19) · TypeScript · Tailwind v4 · shadcn/ui · file-based routes
in `src/routes/`. `npm run dev` → http://localhost:8080.

- `src/components/miis/AppShell.tsx` — shell, sidebar nav, and the shared primitives
  (`Panel`, `Field`, `Button`, `PageHeading`, `ReqTag`, `StatusDot`). Build on these
  rather than inventing new ones; if a new primitive is needed, add it here.
- `src/components/miis/AiPanel.tsx` — the AI assistant side panel.
- `src/components/miis/Placeholder.tsx` — the stub used by not-yet-designed views.
- `src/components/ui/*` — untouched shadcn/ui. Restyle via tokens, not by editing these.
- `src/styles.css` — all design tokens. Change design here first, components second.

Routes are generated into `src/routeTree.gen.ts` by the Vite plugin — never edit that
file by hand.

## Working agreement

- Prototype data is hard-coded in each route file, in Swedish, and must be
  **realistic**: real Swedish party names (Teknikföretagen, IF Metall, Almega, Unionen,
  Kommunal, Sveriges Lärare, Fremia), plausible agreement names, dates in the
  2026–2027 bargaining round. Fake-looking data reads as an unfinished prototype.
- Prefer editing an existing view over adding a new route. The nav in `AppShell.tsx`
  is fixed at 11 items and mirrors the requirement Epics.
- After a UI change, verify it in the browser (`/skiss-test`), don't just assume.
- Keep the branch working: commits pushed to the connected branch appear in Lovable.
