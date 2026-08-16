# Prompt library

Copy, paste, adapt. Grouped by where you type them.

---

## A. Claude Design (claude.ai/design, in the browser)

### A1 · Build the MIIS design system — do this first, once

> I'm designing the UI for **MIIS**, an internal case-handling system for
> Medlingsinstitutet, the Swedish National Mediation Office. It's a government
> authority: calm, authoritative, high legibility, no SaaS gloss — no gradients, no
> glassmorphism, no heavy shadows, no big rounded corners.
>
> I'm attaching the design tokens and CSS. Use them as the source of truth; don't
> invent colours or type sizes.
>
> Build me a component inventory with every state (default, hover, focus-visible,
> active, disabled, error, loading, empty), targeting WCAG 2.1 AA:
>
> 1. Buttons — primary, secondary, accent, text link
> 2. Form fields — text, select, date, textarea, checkbox, radio; label above, help
>    text, error text, min 48px control height
> 3. Panel/card — the standard content container, plus sand and mint variants
> 4. Data table — sortable header, row status, horizontal overflow on narrow screens
> 5. Status coding — newly signed agreement (green), signed after mediation (red),
>    remaining (blue). **Colour must never be the only signal — pair each with text.**
> 6. AI proposal pattern — a field pre-filled by AI, clearly marked `AI-FÖRSLAG`, with
>    explicit approve and reject controls. Nothing is ever saved automatically.
> 7. Alerts — info, success, warning, error
> 8. Requirement tag — a small monospace-ish chip showing an ID like `FA-007`
> 9. Side panel — the AI assistant drawer
> 10. Page header — title, subtitle, requirement tags, primary action
>
> UI text in Swedish. Show light mode first, then dark.

Attach: `docs/design-system/design-tokens.json`, `mi-design-system.css`,
`MI_Design_System.pdf`.

### A2 · Explore layouts for one screen

> Here is the requirement for scenario **US-08** in MIIS [paste the `/krav` output].
>
> Give me **three structurally different** layouts for this screen — not three
> variations of the same idea. For each: a one-line rationale, and what the user sees
> first. Swedish labels. Use the attached MI design system.
>
> Optimise for a case officer who does this many times a week, not for a first-time
> visitor.

### A3 · Pressure-test a design

> Critique this screen as if you were the procurement evaluator at Medlingsinstitutet.
> You are scoring "role-based user scenarios and user interface" on relevance, clarity,
> concreteness, feasibility and demonstrated understanding of our work. What is missing,
> what looks generic, and what would make you score it 100% instead of 75%?

### A4 · Role-adapted start pages (FS-001, high value)

> The start page must adapt to the user's role. Design the dashboard for each of these,
> sharing one layout skeleton but with genuinely different content:
>
> - **Avtalsadministratör** — reminders, incomplete registrations, recently registered
>   agreements with status colours, latest events
> - **Medlingsadministratör** — ongoing mediations, decisions awaiting mediators,
>   upcoming party meetings
> - **Medlaradministratör** — mediator register, appointments to complete
> - **Statistikanvändare** — saved searches, latest extracts, snapshot shortcuts
> - **Systemadministratör** — logs, watchword table, configuration
>
> Swedish labels, MI design system, WCAG AA.

---

## B. Claude Code (this terminal)

### B1 · Orientation

```
Read docs/03-screen-backlog.md and the four designed routes. Where is the mockup
weakest as a bid asset, and what would you fix first?
```

```
/krav US-08
```

```
Show me every requirement in the spec that has no visible home in the current UI.
```

### B2 · Build a screen

```
/skiss partstraffar
```

```
/skiss medlare
```

Then refine conversationally:

```
Make the "under mötet" mode the default tab and give it a large notes area that
autosaves visually — this is used live during a meeting with a party.
```

```
The AI panel is the strongest thing in the mockup. Use the same pattern on
this screen: suggestions, source citation, approve/reject per item.
```

```
Show this at 1280px and 1440px and tell me what breaks.
```

### B3 · Test a flow

```
/skiss-test US-01
```

```
Walk US-07 as a medlingsadministratör starting from the start page. Where does the
flow dead-end or require a step the UI doesn't offer?
```

### B4 · Quality passes

```
/granska
```

```
Audit all 12 routes for Swedish UI text. List anything in English with file and line.
```

```
Every status colour in the app — confirm each has a text label next to it, per FR-012
and WCAG. Fix any that don't.
```

```
Check heading order on every route: exactly one h1, no skipped levels.
```

### B5 · Design system sync

```
Sync my "MIIS Design System" project from Claude Design into design/
```

```
The Panel component in design/ has three tones now. Update
components/miis/primitives.tsx to match, and update every page that uses it.
```

```
Push the current MIIS components in components/miis/ up to my Claude Design
project so I can look at them on the canvas.
```

### B6 · Bid deliverables

```
Take full-page screenshots of all 12 routes at 1440px into screenshots/, named by
route, so I can drop them into the tender document.
```

```
Screenshot the start page once per role using the role switcher, so I have the
role-adaptation story (FS-001) as a set of images for the tender document.
```

```
Write a short Swedish caption for each screen — one sentence saying what the user
does there and which requirement IDs it realises.
```

```
Build a demo script for the 15-minute oral presentation: which screens, in what
order, and the one sentence to say on each.
```

---

## C. Prompting habits that pay off here

- **Ask for a critique before asking for a change.** "What's wrong with this screen?"
  produces better work than "make it nicer."
- **Name the role.** "For a mediation administrator during a live party meeting" beats
  "for a user."
- **Ask for the unhappy path.** Empty state, error state, and *the AI got it wrong*
  state. The last one is a requirement (FAI-002) and almost nobody's mockup shows it.
- **Reject the first answer once.** The second attempt is usually noticeably better.
- **Anchor to the spec.** "Which Feature IDs does this screen satisfy, and which named
  fields are still missing?" catches gaps no amount of visual polish will.
