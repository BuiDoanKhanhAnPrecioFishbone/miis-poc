# Start here

Everything you need to do the UX/UI for the MIIS bid, and the AI workflow to do it fast.

**Deadline: tender response 2026-08-25.** Oral presentation at Medlingsinstitutet in
week 35. Today the mockup has 4 designed screens and 8 stubs.

---

## 1. What this is

Medlingsinstitutet (the Swedish National Mediation Office) is procuring a new internal
system, MIIS, to replace a W3D3 customisation that has hit its limits. We are bidding.

The bid is scored with an added-value model. Of the SEK 2.5M in total added value,
**SEK 1M — 40% — is for "Role-based user scenarios and user interface"**. The UX/UI you
produce is the single largest scoring item in the bid. Scoring per criterion is
100/75/50/25/0% based on *relevance, clarity, level of concreteness, feasibility and
demonstrated understanding of the assignment*.

Practically: the evaluators want to see that we understood **their** work — eight roles,
20 scenarios, Swedish labour-market domain — not that we can make a pretty dashboard.

## 2. The three tools and who does what

| Tool | What it's for | Where |
|---|---|---|
| **Claude Design** | Visual thinking. Explore layouts, component variants, states, and a real design system — fast, disposable, no code discipline. | claude.ai/design, in the browser |
| **Claude Code** | Turning decisions into the actual mockup, in this repo. Reads the requirements, keeps tokens/Swedish/WCAG consistent, screenshots the result. | this terminal |
| **Vercel** | Where the CEO sees your work. Every push builds a URL she can click. | vercel.com |

The loop is: **explore in Claude Design → decide → implement in Claude Code → look at it
in the browser → repeat.** Details in [`01-workflow.md`](01-workflow.md).

## 3. First 15 minutes

```powershell
cd C:\D\miis_poc
npm install          # already done once during setup
npm run dev          # http://localhost:8080
```

Click through all 11 nav items. Four are designed (Start, Registrera avtal,
Medling → open ärende M-2027/12, Sök & Rapporter); the rest show their requirement list
as a stub. That is the gap you are closing.

Then use the **role switcher in the top-right corner** and watch the start page change.
Eight roles, genuinely different dashboards. That is requirement FS-001 and it is the
single strongest thing to open a demo with.

Then open Claude Code in this folder and type:

```
Read docs/03-screen-backlog.md and give me your read on the three highest-value
things to fix in the existing four screens before I start on the stubs.
```

## 4. What's in this repo

```
app/(miis)/**/page.tsx    THE SCREENS — you work here
components/miis/          product components — and here
components/ui/            vendored shadcn/ui — restyle via tokens, don't edit
app/globals.css           all design tokens — change design here first
lib/domain/               types + pure rules (roles, status, agreements)
lib/data/                 every data read goes through here
lib/mock/                 the Swedish sample data
docs/
  00-START-HERE.md        this file
  01-workflow.md          the daily Claude Design ↔ Claude Code loop
  02-prompt-library.md    copy-paste prompts that work — start here when stuck
  03-screen-backlog.md    all 12 screens, priority, requirement IDs, status
  04-ux-brief.md          what actually earns points, per screen
  05-claude-design-setup.md  what to upload, creating the project, syncing back
  06-migration-plan.md    the architecture, and the week-2 backend plan
  07-designer-setup.md    installing everything on a new laptop
  requirements/           the requirement spec (.docx + searchable .txt)
  design-system/          MI tokens, CSS, Tailwind theme, the PDF spec
  sketches/               the CEO's four v1 UI sketches (PNG)
  source-zips/            original attachments, untouched, for reference
design/                   design-system bundle synced with Claude Design
.claude/commands/         slash commands: /skiss, /skiss-test, /granska, /krav
```

**You only ever need to touch the first three.** The `lib/` folders exist so that when
a real database arrives next week, none of your screens have to change — a page asks
`lib/data/` for what it needs and renders it. If you need data that doesn't exist yet,
ask Claude Code to add it to `lib/mock/` and expose it through `lib/data/`; don't paste
sample data into a page. `npm run lint` will stop you anyway.

## 5. The four custom commands

Typed in Claude Code. They are just saved prompts — read them in `.claude/commands/`.

- `/krav US-08` — pull everything the spec says about a scenario or feature ID, and
  what it implies for the interface. **Always start a screen with this.**
- `/skiss partstraffar` — design and implement a view end to end: requirements → layout
  → Swedish copy → code → screenshot.
- `/skiss-test US-01` — walk a scenario in a real browser, screenshot each step, report
  what breaks in the flow.
- `/granska` — audit the changed screens against WCAG 2.1 AA, the MI tokens, Swedish
  copy and requirement traceability.

## 6. Rules that are not negotiable

Full list in [`CLAUDE.md`](../CLAUDE.md) (Claude Code reads it automatically every
session). The short version:

- Swedish UI text, always.
- Tokens only, no hard-coded colours.
- WCAG 2.1 AA — it is requirement NFUI-003, and evaluators will check.
- Requirement IDs visible on every view (`<ReqTag />`).
- AI proposals always need human approval, always labelled `AI-FÖRSLAG` (FAI-002).
- Never redraw the MI logo — it contains a protected state emblem.

## 7. Showing the CEO

The repo started as her Lovable export (`MIIS Demo Delight.zip`) and has since moved to
Next.js — see [`06-migration-plan.md`](06-migration-plan.md). **It no longer opens in
the Lovable editor.** She reviews the deployed Vercel URL instead.

Working rhythm:

```powershell
git checkout -b design          # work on a branch, not on main
# …build a screen…
git add -A
git commit -m "US-08: partsträffar med interaktiv mötesvy"
```

- Commit after each finished screen, with the scenario in the message.
- Push and the deployment updates; send her the link.
- Screenshots from `/skiss-test` are the fastest way to show progress in a message —
  she can react to pictures without opening anything.

> Do not force-push, rebase or amend pushed commits. Others review from this history and
> from builds of it.

## 8. Working with data

There is no database yet — one arrives next week if the CEO says go. Until then the app
runs on Swedish sample data in `lib/mock/`, read through `lib/data/`.

What that means for you day to day:

- **Need different sample data on a screen?** Ask Claude Code to change `lib/mock/`. It
  is one place, plainly written, no database knowledge needed.
- **Relations are by id and nothing enforces them.** A mediation case lists
  `avtalIds: ["A-002"]`, and if no agreement `A-002` exists, nothing complains — the
  screen just shows less than you expected. When you add records, check the ids match.
- **Everything is fake, including the AI.** The AI panel returns a canned answer. That
  is fine for demonstrating the *interaction*, which is what is being scored.
