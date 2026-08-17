# US-01 registration form — decision log

Every restructure of the AI-proposal panel, checked against two sources:

1. **The sketch** — `docs/sketches/MIIS_Skiss_US01_Registrering.png`, the CEO's v1.
   Design input, not binding, but it is what the tender's chapter 9 shows MI.
2. **The requirement** — MI's Appendix 1 Features, and our own US-01 scenario in
   `docs/requirements/requirements-v2.5-EN.txt` chapter 8. Binding.

Where they disagree, the requirement wins and the row says so.

| # | Decision | Sketch | Requirement | Chosen | Why |
|---|---|---|---|---|---|
| 1 | **Layout** | Form with fields | US-01: "the system shows the **pre-filled form**"; §4.1 "**Quick registration**". No requirement anywhere for per-field approval or a review queue | **Sketch** | The officer is registering an agreement, not adjudicating a machine. "Quick" rules out nine decisions. |
| 2 | **Panel title** | "Matchat avtal – AI-förslag kräver ditt godkännande" | FAI-002 requires manual approval | **Sketch** | The title states the obligation and the AI's claim in one line. Better than our neutral "Granskning av AI-förslag". |
| 3 | **Fields shown** | 2 (Avtalsområde, Avtal) + 3 dates | FA-001 requires agreement name, **alternative name**, **parties** and **agreement type**; US-01 repeats all four | **Requirement** | The sketch is abbreviated. Dropping alternativt avtalsnamn, AGO, ATO and avtalstyp would fail FA-001. |
| 4 | **Which fields carry `AI-FÖRSLAG`** | Only the first two | FAI-001 has AI proposing validity period and parties; US-01 has AI analysis 2 proposing signing date, validity and termination. FAI-002 requires proposals to be labelled | **Requirement** | The sketch leaves the three date fields unlabelled although the scenario says AI produced them. Every AI-filled field gets the pill. |
| 5 | **Actions** | `Godkänn` / `Justera` | US-01: "the officer **adjusts as needed and approves manually**"; alt flow: "the officer **corrects freely** before approval". No "reject" anywhere | **Both agree** | `Avvisa` was mine and is dropped. There is no field-level reject in a registration form — the field still needs a value. |
| 6 | **Editable fields** | Input-shaped, with `Justera` implying an edit mode | "Corrects freely before approval" | **Requirement, refining the sketch** | Fields are editable from the start. A separate `Justera` mode costs a click and buys nothing; the word survives as the `JUSTERAD` state. See "departures" below. |
| 7 | **Approval scope** | One `Godkänn` for the panel | FAI-002: approval "**before being saved**" — scoped to the save, not to each field | **Sketch** | This is exactly where my earlier reading went wrong. One approval per panel. |
| 8 | **Source linking** | Absent | FAI-001 (extraction *from* the protocol), FAI-004 (highlight in documents), FR-003 (free-text search in documents) | **Ours, kept** | Additive, requirement-supported, and the strongest idea on the screen. Selecting a field marks the passage it came from. |
| 9 | **Confidence badge** ("Låg träffsäkerhet") | Absent | **No requirement mentions confidence, probability or certainty** | **Dropped** | Same test that removed the general AI assistant. An unrequested feature reads as requirements not read closely. |
| 10 | **The AI-got-it-wrong state** | Absent | US-01 alt flow: "The AI proposal is wrong: the officer corrects freely before approval"; FH-001 logs old and new value | **Ours, kept — relabelled** | `AVVISAD` becomes `JUSTERAD`, with the AI's original kept beside the officer's value. That pair is what FH-001 records. |
| 11 | **"Inget sparas utan manuellt godkännande"** | Inline beside the buttons | FAI-002 | **Sketch** | It is operational — it tells the user what will happen. It had been demoted to a `Rationale`; it belongs on screen. |

## Deliberate departures from the sketch

Two, both narrow.

**Fields are editable immediately** (row 6). The sketch's `Justera` presupposes a
read-only preview that has to be unlocked. "Corrects freely" reads against that: the
officer should be able to fix a wrong value where they see it. So `Justera` is not a
button; it is what happens, and the field then shows `JUSTERAD` with the AI's original
underneath and a control to put the proposal back.

**All AI-filled fields are labelled** (row 4), including the three the sketch leaves
bare. FAI-002's labelling obligation does not distinguish between analysis steps.

## Not changed, and why

The sketch folds *Allmänna villkor* and *Registreringsstatus* into the wage-agreement
panel — two panels on the right in total, against our five. Ours are all
requirement-backed content (FA-003/FA-004, FA-021, FF-002/FD-001, D-001), so this is a
question of compactness rather than correctness. Worth revisiting if the screen feels
long, but it is not a fix for anything.
