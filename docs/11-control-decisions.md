# Control decisions — steps 1–3 of the action inventory

Making the eight inert controls real. Each decision checked against the CEO's sketches
(`docs/sketches/`) and the requirement, in the same form as `docs/09-us01-form-decisions.md`.

Scope: the five fake `▾` dropdowns, the three fake toggles, the query builder's tabs and
free-text field, and the option catalogue behind them. Not in scope: the party-meeting
three-mode tabs (FF-004) and the user/role screen (NFÅ-005) — both need their screens
first.

---

## What the sketches show

**US-01** puts a `▼` on *Avtalskonstruktion* and on *Registreringsstatus*, and draws
*Jämställdhetsflagga* as a switch. So all three of those are controls in the sketch, not
labels — we rendered them as text.

**US-11** puts a `▾` on all three parts of a condition row (field, operator, value),
shows the free-text field as a real input, and shows the four information types as
filled/unfilled pill tabs.

---

## Decisions

| # | Decision | Sketch | Requirement | Chosen | Why |
|---|---|---|---|---|---|
| 1 | **Avtalskonstruktion** | `▼` dropdown | **FA-007** names the seven constructions | Both agree | Real `<select>`, 7 options from `AGREEMENT_CONSTRUCTIONS`. Longest closed list in the whole spec. |
| 2 | **Registreringsstatus** | `▾` dropdown | **FA-021** (Ofullständig vs Klar) | Both agree | Real `<select>`, 2 options. Drives the FR-012 colour preview beside it. |
| 3 | **Jämställdhetsflagga** | switch | **FA-011** ("flag per agreement") | Both agree | Real `role="switch"`. |
| 4 | **Industrimärke** | not drawn | **FA-012** ("industry benchmark flag") | Requirement | Same treatment — the requirement calls it a flag. |
| 5 | **Sekretessmarkering** | not drawn (it is US-05) | **D-001** | Requirement | Same treatment. Flipping it must move the marker beside it, or the screen still only claims the behaviour. |
| 6 | **Condition field / operator / value** | `▾` on all three | **FR-002** ("selection criteria on all relevant properties") | Both agree | Three real `<select>`s, chained: the field decides which operators and which values are offered. Three unrelated dropdowns would not be a query builder. |
| 7 | **Free text in documents** | real input | **FR-003** | Both agree | Real `<input>`; ours was a static span. |
| 8 | **Information type** | four pill tabs | **FR-002** ("choice of information type") | Both agree | Real tabs, roving tabindex, `aria-selected`. |
| 9 | **Handlingstyper** | **not in the sketch** | §2.5 and US-11: today's builder is "limited to two document types simultaneously" — beating that is the screen's argument | Requirement | Keep, and make them genuinely multi-selectable. A static chip row cannot demonstrate the one thing the screen exists to prove. |
| 10 | **Bokslutsläge** (snapshot on/off) | **not in the sketch** | **FH-003** asks to reconstruct data *as at a date* — it says nothing about a mode | **Delete it** | The date alone carries FH-003: a date set means a snapshot, empty means now. A second control to say "yes I meant it" is a control we invented. Removing it is better than wiring it. |
| 11 | **OCH / ELLER placement** | per junction, between rows (flat) | **FR-002** ("combinable with and/or") | **Depart from sketch** | Already decided in the update plan §5.3: a flat list cannot express `(A ELLER B) OCH C`. Groups stay. |
| 12 | **Status column in results** | dot only, no label | **FR-012** + NFUI-003 | **Depart from sketch** | Already decided (update plan §3.1). Colour alone fails 1.4.1. |

**Net: one control deleted, seven made real, two departures already on the record.**

---

## How the controls are built

`Toggle` and `Select` are **self-contained client components with their own state**, so
they drop into server-rendered pages without turning a page into a client component.
That keeps structural rule 3 — pages stay server components that `await` a `lib/data/`
function — while the controls still work.

`lib/domain/options.ts` holds the catalogue: searchable fields, the operators each one
allows, and the values each one offers. Pure, no I/O, no React. It is what makes
decision 6 a chain rather than three dropdowns that ignore each other.

Four searchable fields to start — the three the sketch draws plus one boolean, so the
catalogue exercises every value kind it defines:

| Field | Operators | Values | Requirement |
|---|---|---|---|
| Avtalskonstruktion | är / är inte | the seven constructions | FA-007 |
| Sektor | är / är inte | privat / stat / kommuner och regioner | FP-001 |
| Giltig vid tidpunkt | per | a date | FA-020, FH-003 |
| Industrimärke | är | ja / nej | FA-012 |

## States

Every control ships with the seven states from the inventory. The two that were missing
everywhere and matter most here:

- **selected/checked** must not be colour alone — a `switch` gets its state in text
  beside it, a tab gets `aria-selected` plus a weight change, not just a fill.
- **focus-visible** is the global 3px ring; a custom control must not swallow it.
