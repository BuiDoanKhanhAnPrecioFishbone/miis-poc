---
description: Audit the MIIS mockup against WCAG 2.1 AA, MI tokens, Swedish copy and requirement traceability
argument-hint: "[route or blank for everything changed]"
---

Audit the MIIS mockup: **$ARGUMENTS** (if blank, audit everything changed since the last
commit; if that is empty, audit all pages in `app/(miis)/`).

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

- No hard-coded hex colours or `rgb()` outside `app/globals.css` — everything through
  tokens
- No ad-hoc font sizes outside the scale
- Spacing follows the token scale rather than arbitrary values
- Components reuse the primitives in `components/miis/primitives.tsx` instead of
  redefining panels, buttons or fields inline
- Every interactive component has default / hover / focus / active / disabled states

## 3. Architecture

- `lib/domain/` imports nothing — no React, no Next, no data access
- No page or component imports `lib/mock/` or a database client directly; data comes
  from a `lib/data/` function
- Pages are server components that `await` data; nothing fetches inside a component
- `"use client"` appears only where state or event handlers genuinely require it
- No sample data inlined in a page that should live in `lib/mock/`
- Ids referenced across mock records resolve (npm run build enforces this)
- No hand-written read model that duplicates a derived one — table rows come from
  lib/data/ helpers, not from a second array in lib/mock/
- Identifiers are English; only user-facing strings are Swedish
- `npm run lint` and `npm run build` both pass

## 4. Swedish copy

- All UI text in Swedish — labels, buttons, headings, empty states, `metadata` titles
  and descriptions, `aria-label`s
- Correct domain terminology (avtalsområde, avtalskonstruktion, förhandlingsordningsavtal,
  partsträff, bevakningsord, Märket, ofullständig/fullständig registrering)
- Sample data is realistic Swedish labour-market data, not placeholder text

## 5. Requirement traceability

- Every route carries its `<ReqTag />` IDs
- IDs used actually exist in `docs/requirements/requirements-v2.5-EN.txt`
- Flag any route whose visible content doesn't match the requirements it claims

## 6. AI-pattern compliance (FAI-002)

- Every AI-derived value is labelled `AI-FÖRSLAG`
- Approve/reject exists per field, not only as a bulk action
- Nothing implies an automatic save

## Report

Findings ranked by severity, then: **the three fixes worth doing first**. Ask before
applying anything beyond trivial, unambiguous corrections.
