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
| **Lovable** | The CEO's original mockup, and where she can look at progress. Sync is via GitHub. | lovable.dev |

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

Then open Claude Code in this folder and type:

```
Read docs/03-screen-backlog.md and give me your read on the three highest-value
things to fix in the existing four screens before I start on the stubs.
```

## 4. What's in this repo

```
docs/
  00-START-HERE.md        this file
  01-workflow.md          the daily Claude Design ↔ Claude Code loop
  02-prompt-library.md    copy-paste prompts that work — start here when stuck
  03-screen-backlog.md    all 12 screens, priority, requirement IDs, status
  04-ux-brief.md          what actually earns points, per screen
  requirements/           the requirement spec (.docx + searchable .txt)
  design-system/          MI tokens, CSS, Tailwind theme, the PDF spec
  sketches/               the CEO's four v1 UI sketches (PNG)
  source-zips/            original attachments, untouched, for reference
src/                      the mockup itself
design/                   design-system bundle synced with Claude Design
.claude/commands/         slash commands: /skiss, /skiss-test, /granska, /krav
```

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

## 7. Syncing with the CEO's Lovable project

This repo was bootstrapped from the CEO's export (`MIIS Demo Delight.zip`), so it is
identical to her mockup but not yet *connected* to it. To connect:

1. Ask her to open the Lovable project → **GitHub → Connect** (only the project owner
   can do this), and to give you the repository URL.
2. Then, in this folder:

   ```powershell
   git remote add origin <repository-url>
   git fetch origin
   git checkout -b design origin/main   # work on a branch, not on main
   ```

3. Push the `design` branch and open a pull request when you want her to review.
   Anything merged to the connected branch shows up in her Lovable editor.

Until then, work locally — nothing is lost, the history transfers.

> Do not force-push, rebase or amend pushed commits. Lovable mirrors this history and
> rewriting it destroys her project history.
