# Action inventory

Every interactive control MIIS needs, derived from the requirements rather than from
what the mockup happens to have. Each row cites the Feature ID or scenario that demands
it; anything without a citation is marked **not required** and has to justify itself
separately.

Written 2026-08-18. Read alongside `docs/08-design-system-and-interaction-plan.md` §5,
which this replaces and expands.

## Where we are

| | |
|---|---|
| Real, wired controls | 4 text inputs · 7 native selects · 16 handlers · 31 sortable columns |
| `Button` instances | 36 (20 of them are commands with no handler — expected in a mockup) |
| **Inert but interactive-looking** | **5 fake `▾` dropdowns · 3 fake toggles · 2 static tab sets** |

The eight fake dropdowns and toggles are the problem. A `Button` that does nothing reads
as "not wired in the demo"; a control drawn to look like a dropdown that cannot open
reads as "this is a picture of software".

---

## 1. Command buttons

The largest group and mostly already present. A command **does** something and ends.

| Action | Requirement | Where | State |
|---|---|---|---|
| Upload agreement protocol | FD-001, US-01 | start page, `/registrera` | button exists |
| Upload GD decision | FSD-001, US-07 | start page, `/medling` | button exists |
| Approve the AI proposals | **FAI-002** | `/registrera` | **real** |
| Save as complete / save as incomplete | **FA-021** | `/registrera` | buttons exist |
| Set a reminder | **FA-022**, US-04 | `/rapporter`, agreement view | button exists, opens nothing |
| Confidentiality-mark an agreement | **D-001**, US-05 | `/registrera` | toggle, inert |
| Search | FR-001, FR-002 | `/sok` | button exists |
| Save a search | **FR-002** | `/sok` | button exists |
| Add condition / add group / remove either | **FR-002** ("combinable with and/or") | `/sok` | **real** |
| Export to Excel | **FR-004** | `/sok` | button exists |
| Export CSV / JSON | FR-013 *(desirable)* | `/sok` | button exists |
| Generate report (Word/Excel/PDF) | **FR-005** | `/rapporter` | button exists |
| Print the Short-Term Wage Report | **FR-008** | `/rapporter` | button exists |
| Mark agreements as exported | **FR-008** ("tracking of which agreements have previously been exported") | `/rapporter` | button exists |
| Create GD decision **with** notice | **FSD-001** | `/medling/[id]` | button exists |
| Create GD decision **without** notice | **FSD-001** | `/medling/[id]` | button exists |
| Finalise the decision | **FE-001** | `/medling/[id]` | button exists |
| Create party meeting document | **FSD-002** | `/partstraffar` | screen not built |
| Link an agreement to a case | **FF-008** | `/medling/[id]` | button exists |
| Add a mediator to a case | **FF-009** | `/medling/[id]` | button exists |
| Register standing mediation (simplified form) | **FF-006** | `/medling/[id]` | button exists |
| Create a user / assign a role | **NFÅ-005**, US-12 | `/administration/anvandare` | screen is a stub |
| Add a scheduled extract | FR-014 *(desirable)* | `/rapporter` | button exists |
| Download the public selection | **FR-011**, US-14 | `/allmanheten` | button exists |

**Rule.** Commands are `Button`. `primary` for the one action that completes the step,
`secondary` for alternatives, `danger` only for something destructive, `ghost` for
in-row and undo actions.

---

## 2. Toggles — binary flags the requirement names as flags

Every one of these is a two-state property of a record, not a command.

| Flag | Requirement | State |
|---|---|---|
| Gender equality flag | **FA-011** ("Gender equality flag per agreement") | fake |
| Industry benchmark flag | **FA-012** | fake |
| Confidentiality marking | **D-001** | fake |
| Individual guarantee | **FA-010** | plain text |
| Working time reduction present | **FA-009** | plain text |
| Agreement expires and is not renewed | **FA-015** | not built |
| Industrial action taken | **FF-010** | plain text |
| Coordinated / own-union demand | **FF-005** | not built |
| Negotiating body Yes/No | **FP-003** | not built |
| Scheduled extract active / paused | FR-014 | badge only |

**Rule.** A real `<button role="switch" aria-checked>`, 44px hit area, label always
adjacent, state visible in text as well as position — never colour alone. The three
currently drawn as two nested `<span>`s cannot be operated at all.

---

## 3. Radio / segmented — mutually exclusive, small closed set

| Choice | Options | Requirement |
|---|---|---|
| Registration status | Ofullständig / Klar | **FA-021** |
| Party type | AGO / ATO | **FP-001, FP-002** |
| Cooperation body type | Huvudorganisation / Samverkan | **FP-003** |
| Mediation type | Särskild / Fast | **FF-006, FF-009, FF-010** |
| Mediator position | Ettan / Tvåan | **FF-009** |
| Negotiation type | Avtalsrörelse / Övrig | **FF-001** |
| Negotiation attachment | linked to agreement / standalone | **FF-001, FF-003** |
| Group operator | OCH / ELLER | **FR-002** — **real** |

**Rule.** Two or three options that must all stay visible → segmented control
(`Button` pair with `aria-pressed`, as the OCH/ELLER pair already does). More than
three, or where the options are data rather than modes → `Select`.

---

## 4. Select — a closed list too long to show at once

| Field | Requirement | State |
|---|---|---|
| Agreement construction (1–7) | **FA-007** ("general increase, wage pot, individual negotiation, etc.") | fake `▾` |
| Sector | **FP-001** (private / state / municipalities and regions) | not built |
| Employer group, industry code | **FP-001** | not built |
| Matched agreement | **FAI-001, FA-018** | text input |
| Occupational group | **FA-013** | not built |
| Information type in the query builder | **FR-002** ("choice of information type") | static tabs |
| Search field / operator / value | **FR-002** | fake `▾` ×3 per row |
| Snapshot mode | **FH-003** | fake `▾` |
| Report format | **FR-005** (Word/Excel/PDF) | plain text |
| Schedule frequency | FR-014 | plain text |
| AGO / ATO / agreement selection | **FR-011**, US-14 | **real** on `/allmanheten` |

**Rule.** A native `<select>` unless the list needs search. Native gets keyboard,
mobile and screen-reader behaviour for free, and MIIS has no list long enough to need a
combobox — the longest closed list in the requirements is seven.

---

## 5. Multi-select — checkbox groups

| Selection | Requirement | State |
|---|---|---|
| Presentation columns | **FR-002** ("choice of presentation columns") | **real** |
| Document types in one search | **FR-002** (the current system's two-type limit is the thing we beat) | chips, not selectable |
| Report selections per agreement | §4.2 (Eurofound, minimilön, webbplats, konjunkturlön) | not built |
| Agreements included in an extract | **FR-008** | **real** |
| Unions backing a coordinated demand | **FF-005** | not built |

---

## 6. Tabs

| Tab set | Requirement | State |
|---|---|---|
| Query builder information type | **FR-002** | static spans |
| Party meeting: before / during / after | **FF-004** ("before and after a meeting, plus an interactive view for entering information directly during the meeting") | screen not built |
| Reports hub | grouping of FR-005–008 — **ours, not required** | anchor links |

The party-meeting tab set is the one the requirement literally describes as three modes,
and it is on the unbuilt screen the backlog ranks P1.

---

## 7. Date and date-range

| Field | Requirement |
|---|---|
| Signing date, validity from/to | **FA-004** |
| General terms' own period | **FA-003, FA-004** |
| Reminder date | **FA-022** |
| Snapshot date | **FH-003** ("reconstruct how the data looked on a specific date") |
| Valid-at date | **FA-020**, FA-025 |
| Name-change validity | **FP-002, FP-004** |
| Wage revision date | **FA-013** |
| Early termination date | **FA-016** |

**Rule.** Native `<input type="date">`, ISO display in both languages. Already used on
`/allmanheten`.

---

## 8. Free-text search

| Input | Requirement |
|---|---|
| Free text in uploaded documents and selections | **FR-003** |
| Search on all key concepts with filters | **FR-001** |

---

## 9. Navigation actions

| Action | Requirement | State |
|---|---|---|
| Open the protocol **even when registration is incomplete** | **FR-008** | link exists |
| Open an agreement as it was at a date | **FA-020**, FA-025 | link exists |
| Deep link from an e-mail into an agreement or case | **FE-002** | not built |
| Back out of a detail view | — *(not required, ours)* | **real** |

---

## 10. Not required by anything — must justify themselves

| Control | Why it exists | Verdict |
|---|---|---|
| Column sorting (31 columns) | ours | Keep. FR-002 presentation columns and NFP-001's "no capacity ceiling" make long lists certain; sorting is how you survive them. Cheap and standard. |
| Role / dataset / language / requirement-ID switches | reviewer tooling | Keep, in the demo bar, labelled as not part of the system. |
| Source-linking on an AI proposal | ours | Keep — FAI-001, FAI-004 and FR-003 all support it. |
| Pagination | inferred from NFP-001 | Not built. Decide before a screen shows 3 500 agreements. |
| Delete / destructive confirm | NFL-002 logs deletions, so deletion exists | No screen requires it yet. Do not invent one. |

---

## Plan

Ordered so the cut line can fall anywhere.

**Step 1 — the eight liars.** Replace every control that looks interactive and is not:
`Select` (5) and `Toggle` (3). These are the only ones that actively mislead, and they
sit on `/registrera` and `/sok`, the two screens the demo spends most time on.

**Step 2 — `Tabs`.** Real roving-tabindex tabs for `/sok`'s information type
(**FR-002**), and keep `/rapporter` on anchors since its grouping is ours, not a
requirement.

**Step 3 — option catalogues.** `lib/domain/options.ts`: the seven constructions, the
three sectors, the searchable fields with their operators and value domains. Pure, no
I/O. This is what makes the query builder's field → operator → value chain real rather
than three unrelated dropdowns.

**Step 4 — the flags that are currently prose.** FA-009, FA-010, FF-010 are rendered as
"Ja"/"Nej" text. They are flags in the requirement and should be toggles, read-only or
not.

**Step 5 — reminder popover (FA-022).** The one command in the table above that opens
something rather than completing. Needs a date input and a confirmation.

**Deliberately not doing before the freeze:** the party-meeting three-mode tab set
(FF-004) and the user/role screen (NFÅ-005) — both need their screens built first, and
both are already ranked in `docs/03-screen-backlog.md`.

## States every control must have

Applies to all of the above. Most currently have two or three of the seven.

| State | Requirement |
|---|---|
| default | — |
| hover | background shift only, never a size change |
| focus-visible | the global `3px solid var(--mi-focus)`, offset `3px` — never overridden |
| pressed / selected | `aria-pressed` or `aria-checked`; never colour alone |
| disabled | `aria-disabled` plus a reason; never a silently dead control |
| invalid | `aria-invalid` plus a message; a red border alone fails 1.4.1 |
| busy | only where something genuinely takes time (search, NFP-003 allows 3 s) |
