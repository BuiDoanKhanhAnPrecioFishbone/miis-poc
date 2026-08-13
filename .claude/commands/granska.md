---
description: Audit the MIIS mockup against WCAG 2.1 AA, MI tokens, Swedish copy and requirement traceability
argument-hint: "[route or blank for everything changed]"
---

Audit the MIIS mockup: **$ARGUMENTS** (if blank, audit everything changed since the last
commit; if that is empty, audit all routes in `src/routes/`).

Check each of the following and report findings with file and line. Rank by severity —
what an evaluator or an accessibility test would actually catch first.

## 1. Accessibility — WCAG 2.1 AA (requirement NFUI-003)

- Exactly one `<h1>` per route; no skipped heading levels
- Every form control has a real, associated `<label>` — not a placeholder standing in
- Visible `:focus-visible` on everything interactive; the skip link still works
- Interactive targets ≥ 44×44px (the spec's own design system says 48px min height)
- **No status communicated by colour alone** — the green/red/blue agreement coding
  (FR-012) must always be paired with text
- Contrast: body text and UI text against their actual backgrounds
- Tables: real `<th>` with scope, and horizontal overflow handled on narrow screens
- Images and icon-only buttons have text alternatives
- Anything animated respects `prefers-reduced-motion`

## 2. Design system

- No hard-coded hex colours or `rgb()` outside `src/styles.css` — everything through
  tokens
- No ad-hoc font sizes outside the scale
- Spacing follows the token scale rather than arbitrary values
- Components reuse the primitives in `src/components/miis/AppShell.tsx` instead of
  redefining panels, buttons or fields inline
- Every interactive component has default / hover / focus / active / disabled states

## 3. Swedish copy

- All UI text in Swedish — labels, buttons, headings, empty states, `head.meta` titles
  and descriptions, `aria-label`s
- Correct domain terminology (avtalsområde, avtalskonstruktion, förhandlingsordningsavtal,
  partsträff, bevakningsord, Märket, ofullständig/fullständig registrering)
- Sample data is realistic Swedish labour-market data, not placeholder text

## 4. Requirement traceability

- Every route carries its `<ReqTag />` IDs
- IDs used actually exist in `docs/requirements/requirements-v2.5-EN.txt`
- Flag any route whose visible content doesn't match the requirements it claims

## 5. AI-pattern compliance (FAI-002)

- Every AI-derived value is labelled `AI-FÖRSLAG`
- Approve/reject exists per field, not only as a bulk action
- Nothing implies an automatic save

## Report

Findings ranked by severity, then: **the three fixes worth doing first**. Ask before
applying anything beyond trivial, unambiguous corrections.
