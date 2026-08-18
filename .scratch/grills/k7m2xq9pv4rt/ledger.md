# Grill ledger — /registrera refinements + constructions report

Started 2026-08-18. Framework: grill-plan.

## Open

| # | Decision | Why it is material |
|---|---|---|
| D1 | **What the protocol pane shows**: the OCR text layer, the page image, or both | Controls the design of the flagship screen, whether watchword highlighting (FAI-004) can be carried to assistive technology at all, and whether the AI icon's "show the source" gesture has anything to point at. MI's spec is silent — checked FD-001, FAI-003, FAI-004 and §4.1. |

## Provisional defaults — low risk, reversible, recorded not asked

| # | Decision | Value | Evidence |
|---|---|---|---|
| D2 | Sidebar navigation sticky | Sticky within the content viewport from `md` up; the mobile disclosure stays as built | User instruction. No competing realistic option at `md`+ |
| D3 | Field-switch jumping | Root cause to be measured, not guessed. Suspected `scrollIntoView` on the pane escalating to the page when the pane cannot scroll further | Reported symptom; technical fact, not a product decision |
| D4 | Remove the `KÄLLA` badge from the pane | Removed | User instruction; the pane already names the field in words above it |
| D5 | AI mark moves from a border to a small icon beside the field | Icon beside the label; selected state is a light violet ring, not a fill | User instruction. Contrast to be measured against WCAG 1.4.11 (3:1 for non-text) |
| D6 | Constructions report | Use MI's Bilaga F figures exactly; do not invent a document type | User instruction. Depends on D7 |

## Depends on an open decision

| # | Decision | Blocked by |
|---|---|---|
| D7 | Whether MI's constructions figures are a fixed report fixture or derived from extended `Agreement` records | D6 is settled, but the shape is not: MI counts employees by sector and by arbetare/tjänstemän, and our records carry neither. Ask after D1 |
| D8 | Whether the AI icon is the only way to reach the source, or focus still triggers it | D1 — if the pane shows a page image, there may be nothing to scroll to |

## Accepted

_None yet._

---

## Turn 2

**D1 ACCEPTED — protocol pane shows both, switchable.** Text view by default, Original
(page image) behind a toggle, the traced highlight following into both. Evidence: user
choice, 2026-08-18. Consequences: the pane needs a real page image asset; the text view
keeps the accessible highlighting FAI-004 needs; the toggle is a new control to label in
both languages.

**D8 ACCEPTED as a default, not asked.** The source gesture is the icon click only, not
focus. Evidence: the user's own two statements — "when clicked" for the icon, and the
jumping reported when switching between fields, which focus-triggered scrolling causes.
Supersedes the focus-driven behaviour shipped in 25dd5c9.

**D9 ACCEPTED — our seven construction names are wrong.** MI's Bilaga F page 41 legend
gives the real list; five of seven differ from `AGREEMENT_CONSTRUCTIONS`. Factual
correction, not a decision. Reaches `/registrera` (FA-007 dropdown), `/sok` (column) and
the report.

**D10 ACCEPTED — the constructions report is a fixture, not derived.** MI's report counts
3 797 764 employees across the whole Swedish labour market; it could never come from eight
sample agreements. The "derived from records" rule in CLAUDE.md was being misapplied to a
population report. Recorded so the rule is not silently broken.

**D11 OPEN — how much of MI's report `/rapporter` renders.** MI's is a six-page printout:
an Urvalskriterier block, two figures (Samtliga avtal / Urvalets avtal, each with antal
avtal and antal anställda per band), a detail table of 7 constructions × Arbetare and
Tjänstemän × Privat/Offentlig/Alla sektorer × count and percent × both column groups, and
a legend. Asking now.

## Turn 3

**D11 ACCEPTED — /rapporter renders MI's full report on screen** in MI's structure:
Urvalskriterier block, Figur 1 (Samtliga avtal) and Figur 2 (Urvalets avtal) with both
antal avtal and antal anställda per band, the detail table in a scrolling region, the
legend, and export buttons beside it.

**D12 ACCEPTED — the sample protocol becomes MI's Bilaga D**: Industriarbetsgivarna &
Unionen, Stål- och metallindustrin, 2020-11-01 – 2023-03-31. Text view is the OCR of that
page, Original view is that page. Ripples: the extraction values, the agreement record,
the wage panel, the negotiation link, docs/09 and every screenshot move with it. The
Kommunikation agreement stays in the dataset — it is real MI data from Bilaga F — it just
stops being the one being registered.

### Defaults recorded, not asked

- **D13** The AI mark is the letters `AI` in violet, not a pictogram. Self-describing,
  needs no learning, and reuses the word already in the panel sentence and in FAI-002's
  labelling obligation. The last icon failed because it was a symbol for a concept with no
  conventional symbol.
- **D14** Original view fits the page to the pane width with the traced region boxed over
  it; reading is what the Text view is for. A control opens the page full size.
- **D15** Highlight regions on the page image are hand-authored rectangles. They describe
  where text genuinely sits on MI's page, so this is not invented content.
- **D16** No special framing for the 2020 dates. NFM-002 is migration of the Access
  database, so a historical protocol being registered is ordinary, and the screen never
  claims a "today".
- **D17** The rest of the dataset stays in the 2026-27 round; only the registered protocol
  is historical.

**D18 OPEN — how much of the document the Text view contains.** Asking now.

## Turn 4

**D18 ACCEPTED — the Text view holds the full OCR text of the pages MI supplied**, all
sections, including those no proposal points at.

**D3 RESOLVED by measurement, not by asking.** Focusing a field moves the *page* by up to
895px while the pane's own scrollTop stays at 0 — `scrollIntoView` walks up the scroll
chain and scrolls the document. Measured across seven fields at 1440×900. Fix: set the
pane's `scrollTop` arithmetically and only when the target sits outside the visible band;
never call `scrollIntoView`.

**No remaining question passes the four-part filter.** Presenting the handoff.

---

## Built — 2026-08-18

All material entries `accepted`. Every acceptance criterion verified in a browser:

| Criterion | Result |
|---|---|
| Tracing never moves the page | 0px across 6 fields (was up to 895px) |
| Focus alone does not trace | pass |
| Text / Original toggle present, image renders | pass |
| Source badge removed from the pane | pass |
| Empty required field beats AI styling | pass |
| Nav sticky after 2000px scroll | pass |
| MI's figures exact (2 335 364 / 1 462 400 / 3 797 764 / 893 047 / 23,5) | pass |

axe: 50 runs across 10 routes × 5 configurations — 0 violations, 0 horizontal-scroll
failures.
