# Claude Design: what to upload, how to create the project, how to get it back

Three questions, answered in order. Do this once, at the start — it pays for itself by
the third screen.

---

## 1. What to upload

Upload in this order. Each layer answers a different question, and Claude Design gets
noticeably better answers when the brand rules arrive before the screens.

### Layer 1 — the brand (what it must look like)

| File | What it gives |
|---|---|
| `docs/design-system/design-tokens.json` | The palette, radii, spacing, shadows, containers — machine-readable |
| `docs/design-system/mi-design-system.css` | The same tokens as CSS variables, plus baseline component styles |
| `docs/design-system/MI_Design_System.pdf` | The visual specification — the reasoning behind the tokens |
| `docs/design-system/LOVABLE_IMPLEMENTATION_PROMPT.md` | The brand direction in words: calm Swedish public sector, no gradients/glassmorphism/SaaS rounding, the 10 required components, the accessibility target, the logo restriction |

That last file is the most valuable single upload. It is already written as design
direction, and it carries the constraints that matter (48px controls, 18px body text,
760/1200px containers, WCAG 2.2 AA, logo off-limits).

### Layer 2 — the product (what it is for)

| File | What it gives |
|---|---|
| `docs/sketches/*.png` (4 files) | The CEO's v1 sketches — the layouts already shown to the team |
| `screenshots/*.png` | What the mockup looks like **today**, so Claude Design improves it instead of starting over |
| `docs/04-ux-brief.md` | The eight roles, the domain specifics, the tone, what earns points |

### Layer 3 — the domain, per screen (not all at once)

Do **not** upload `MIIS_Requirements_Specification_v2_EN.docx`. It is 3.9 MB, in English,
and mostly commercial/technical requirements that have nothing to do with visual design.
It will dilute the context.

Instead, when you start a screen, paste in the output of `/krav US-08` from Claude Code.
That is the relevant 40 lines: role, flow, fields, Feature IDs, Swedish terminology.

### What never to upload

- The logo, or any request to generate one. It contains a protected Swedish state
  emblem. Placeholder only.
- The `.docx`, per above.
- `bun.lock`, `package-lock.json`, `node_modules` — no design value.

---

## 2. Creating the project

**The important constraint first:** a Claude Design project's *type* is fixed when it is
created. A design-system project can hold a synced component library; an ordinary
project cannot, and you cannot convert one into the other afterwards. So create it as a
**design system** from the start.

### Route A — let Claude Code create and seed it (recommended)

In Claude Code, in this folder:

```
Create a new Claude Design design-system project called "MIIS Design System",
then push our MI tokens and the existing MIIS components into it:
- docs/design-system/design-tokens.json and mi-design-system.css as the tokens
- components/miis/primitives.tsx and AppShell.tsx as the product components
  (Panel, Field, Button, PageHeading, ReqTag, StatusDot)
- components/miis/AiPanel.tsx as the AI-proposal pattern
Keep the Swedish labels.
```

Claude Code will show you the exact list of files it intends to write before writing
anything, and asks permission the first time it reaches your claude.ai design projects.

The advantage: the project opens in the browser already knowing the MI palette and our
component inventory, so your first design conversation starts from the real thing rather
than from a blank page.

### Route B — create it in the browser

Go to **claude.ai/design**, create a new design-system project, name it
**MIIS Design System**, and upload the Layer 1 files into the conversation with the
prompt in [`02-prompt-library.md` §A1](02-prompt-library.md). Then tell Claude Code to
pull it down (§3 below).

Either route works. Route A is faster and keeps the two sides consistent from minute one.

---

## 3. What the project actually contains

A finished design-system project has this shape. Knowing it makes the sync obvious,
because each folder has a home in our repo:

| In Claude Design | What it is | Where it lands here |
|---|---|---|
| `styles.css` | Single entry point, `@import` list only | — |
| `tokens/*.css` | `colors.css`, `typography.css`, `radius.css`, `layout.css`, `motion.css` | `app/globals.css` — the `:root` token block |
| `guidelines/*.html` | One specimen card per rule: colour rules, type roles, layout rhythm, hard rules | `CLAUDE.md` rules + `docs/04-ux-brief.md` |
| `components/ui/*.jsx` | The shadcn primitives, styled | `components/ui/*` |
| `components/design/*.jsx` | The **product** components — ours would be `Panel`, `Field`, `ReqTag`, `StatusDot`, `AiPanel`, `AppShell` | `components/miis/primitives.tsx` |
| `components/**/*.prompt.md` | Usage notes per component — when to use it, when not to | Read them; they are the design rationale |
| `components/**/*.d.ts` | The component's prop contract | Keeps the React implementation honest |
| `ui_kits/app/*.jsx` | Full click-through screens | `app/(miis)/**/page.tsx` |
| `templates/` | A screen as a copyable starting point | The skeleton for a new route |
| `*.card.html` | The preview cards you see on the canvas | Reference only |

Two things worth knowing:

- **Components are real JSX, not pictures.** What comes back is code Claude Code can
  read and adapt — which is why the round trip is cheap.
- **Sync is file-based and incremental**, one component at a time. It is not a wholesale
  replace, and it will not overwrite the app. Nothing in `design/` is imported by the
  running mockup.

---

## 4. Getting results back into Claude Code

Three levels, depending on what you made. **Most of the time you want level 1.**

### Level 1 — you made a decision, not a file

You explored three layouts and picked one. Nothing needs to sync. Just say it:

```
/skiss partstraffar

Use a three-mode layout: "Före mötet", "Under mötet", "Efter mötet" as tabs, with
"Under mötet" as the default — a wide notes area on the left, the party's coordinated
demands as a checklist on the right.
```

This is the fastest path and it is not cheating. The design system already lives in
`CLAUDE.md` and `app/globals.css`; you are supplying the layout decision, which is the
part that needed a human.

### Level 2 — you built components you want in the app

```
Pull my "MIIS Design System" project from Claude Design into design/
```

Then, component by component:

```
design/components/design/Panel.jsx has a new "warning" tone and a collapsible header.
Port that into components/miis/primitives.tsx, keep our TypeScript types, and update
every route that uses Panel.
```

Port one component at a time and look at the result. A bulk "make the app match the
design system" instruction touches 12 routes at once and is hard to review.

### Level 3 — you designed a whole screen there

```
Pull my "MIIS Design System" project into design/, then build app/(miis)/partstraffar/page.tsx
from design/ui_kits/app/PartsmoteScreen.jsx — adapt it to Next.js App Router, our
primitives and TypeScript, keep the Swedish copy, and add the ReqTags for
FF-004, FF-005, FSD-002.
```

### The reverse direction

When you built something good in code and want it on the canvas:

```
Push components/miis/ up to my Claude Design project as product
components, with usage notes for each.
```

Useful before a design review — the canvas is a much better way to look at a component
inventory than a code editor, and a screenshot of it is a bid asset in its own right.

---

## 5. The habit that makes this work

Keep the design system **ahead** of the app by one step. Design the component in Claude
Design, port it, then use it in three screens. The alternative — designing each screen
from scratch and hoping consistency emerges — is what makes a 12-screen mockup look
like four different products, and consistency is one of the things being scored.
