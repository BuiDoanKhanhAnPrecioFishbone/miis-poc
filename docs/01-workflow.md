# The daily loop: Claude Design ↔ Claude Code

The point of splitting the two tools: **Claude Design is where you decide, Claude Code
is where you commit.** Exploring in code is slow and makes you attached to whatever you
built first. Deciding in the browser and then implementing once is faster and produces a
more consistent mockup.

---

## The loop

```
   ┌─ 1. UNDERSTAND ──────────────────────────────────────────┐
   │  Claude Code:  /krav US-08                               │
   │  → what the requirement actually demands of the screen   │
   └──────────────────────────┬───────────────────────────────┘
                              ▼
   ┌─ 2. EXPLORE ─────────────────────────────────────────────┐
   │  Claude Design: 2–3 layout directions, side by side.     │
   │  Judge them as pictures. Pick one. Throw the rest away.  │
   └──────────────────────────┬───────────────────────────────┘
                              ▼
   ┌─ 3. IMPLEMENT ───────────────────────────────────────────┐
   │  Claude Code:  /skiss partstraffar                       │
   │  Real route, real Swedish copy, MI tokens, ReqTags.      │
   └──────────────────────────┬───────────────────────────────┘
                              ▼
   ┌─ 4. TEST THE FLOW ───────────────────────────────────────┐
   │  Claude Code:  /skiss-test US-08                         │
   │  Clicks through it in a browser, screenshots every step. │
   └──────────────────────────┬───────────────────────────────┘
                              ▼
   ┌─ 5. AUDIT ───────────────────────────────────────────────┐
   │  Claude Code:  /granska    → WCAG, tokens, Swedish, IDs  │
   └──────────────────────────┬───────────────────────────────┘
                              ▼
                    commit · next screen
```

One screen per loop. Roughly 45–90 minutes each once you're warm.

---

## Step 1 — Understand (Claude Code, ~5 min)

```
/krav US-08
```

Claude reads the requirement spec and comes back with: the role, the goal, the main
flow step by step, the alternative/exception flows, every field the spec names, and the
Feature IDs the screen has to display. **Do not skip this and design from intuition** —
the points are for demonstrated understanding of *their* domain, and the spec is
unusually specific about fields (e.g. mediation outcome needs *type of mediation,
industrial action, type of industrial action, lost working days, number of affected
employees*).

Push back on the answer. `"Which of these fields would a mediation administrator
actually see on one screen, and which belong behind a step?"` is a good second question.

## Step 2 — Explore (Claude Design, ~20 min)

Open **claude.ai/design**. Two ways to use it, both useful:

**a) Layout exploration.** Paste the output of `/krav` and ask for two or three
*different* structural approaches, not variations of one. For example, for a party
meeting: a timeline (before/during/after), a three-column live-notes view, a
form-with-agenda-sidebar. Look at them next to each other and pick.

**b) Design system.** Keep a project called **MIIS Design System** holding the real
component inventory — buttons, fields, panels, status coding, the AI-proposal pattern,
tables, alerts — each with its states. It is worth building once, early: it makes every
later screen faster, it keeps the mockup visually consistent, and *it is itself a bid
asset* — a screenshot of a coherent component library is direct evidence of design
maturity for the "user interface" criterion.

> **Set this up first.** [`05-claude-design-setup.md`](05-claude-design-setup.md) has
> the exact file list to upload, how to create the project (its type is fixed at
> creation — it must be a *design system*), what folder structure you get, and the three
> ways to bring work back. Do that once before your first screen.

**Bringing it back into the repo.** Most of the time you don't need to sync anything —
you made a *decision*, and you just tell `/skiss` what you decided. When you did build
components, in Claude Code:

```
Pull my "MIIS Design System" project from Claude Design into design/
```

Claude Code lists your design projects, shows exactly which files it will read or write,
and pulls them into `design/`. Push works the same way, for when you built something in
code you want to look at on the canvas. The first sync asks permission to reach your
claude.ai design projects — that's expected.

What comes down is real JSX plus `.d.ts` contracts and `.prompt.md` usage notes, not
pictures — which is why the round trip is cheap. Claude Code adapts it into the app's
own components in `components/miis/`; nothing in `design/` is imported by the running
mockup.

## Step 3 — Implement (Claude Code, ~30 min)

```
/skiss partstraffar
```

This does the whole screen: reads the requirements, builds the route, writes realistic
Swedish sample data, uses the shared primitives from `primitives.tsx`, tags requirement
IDs, and screenshots the result.

Then iterate in plain language. You do not need to describe code:

- `"Partsträffen behöver tre lägen: före, under och efter mötet. Gör 'under mötet' till standardvyn och de andra två som flikar."`
- `"The demands table is too dense — give it more air and move the coordinated/own-union flag to a column with a text label, not just a colour."`
- `"Show me what this looks like at 1280px wide."`

Work in English or Swedish with Claude, whichever you think in — just keep the **UI
text** Swedish.

## Step 4 — Test the flow (Claude Code, ~10 min)

```
/skiss-test US-08
```

Claude opens a real browser, walks the scenario from the start page as that role,
screenshots each step and reports where the flow breaks: dead ends, missing back paths,
a step the spec requires that has nowhere to happen, states you never designed (empty,
error, loading, the AI-got-it-wrong case).

This is the step that separates a mockup that survives a live demo from one that
doesn't. In week 35 someone will click through this in front of the customer.

## Step 5 — Audit (Claude Code, ~5 min)

```
/granska
```

WCAG 2.1 AA, MI tokens, Swedish copy, requirement traceability. Fix what it finds
before moving on — accessibility debt across 12 screens is much worse than across one.

---

## Working with the CEO

- Commit after each finished screen, with the scenario in the message:
  `git commit -m "US-08: partsträffar med interaktiv mötesvy"`
- Push the `design` branch — the Vercel deployment rebuilds and she reviews there.
  The repo no longer opens in Lovable; the URL replaces it.
- Screenshots from `/skiss-test` are the fastest way to show progress in a message —
  she can react to pictures without opening anything.

## When something goes wrong

| Symptom | Do this |
|---|---|
| Dev server won't start | `npm install` again, then `npm run dev`. Port 8080 busy → close the other terminal. |
| A change didn't show up | Hard-reload the browser (Ctrl+F5). Vite occasionally holds a stale module. |
| Claude edited the wrong file | `git diff` to see everything, `git checkout -- <file>` to undo one file. Commit often so undo is cheap. |
| Claude wrote English UI text | `"UI-texten ska vara på svenska — rätta till det."` It's in `CLAUDE.md`, but say it again. |
| Design drifted from the tokens | `/granska`, then `"fix every hard-coded colour to use the MI tokens."` |
| You want to try something risky | Branch: `git checkout -b experiment`. Throw it away with `git checkout design` if it doesn't work. |
