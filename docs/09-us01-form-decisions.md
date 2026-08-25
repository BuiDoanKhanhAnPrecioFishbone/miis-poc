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

---

# Step 1 — the upload (added 2026-08-18)

The sketch begins at the pre-filled form, so it has nothing to say about how the
protocol got there. This section is therefore checked against the requirement alone,
with the sketch noted where it constrains the result anyway.

The gap it closes was specific: the stepper said **"✓ 1. Ladda upp — Klart"** on a
screen where nothing had been uploaded, and the `OCR` badge asserted FAI-003 rather
than showing it. There was no `<input type="file">` anywhere in the application.

| # | Decision | Requirement | Chosen | Why |
|---|---|---|---|---|
| 12 | **Where the upload lives** | US-01: "The case officer uploads the agreement protocol **from the start page**" | Start-page button → `/registrera`, which opens on step 1 | The action starts on the start page, as the scenario says; the screen it opens is the registration view, as the sketch shows. A modal on the start page would put the file picker somewhere the stepper cannot reach. |
| 13 | **Whether OCR has a button** | US-01: "Scanned documents are **automatically** OCR-interpreted" | No control — the pipeline runs itself | "Automatically" is load-bearing. A *Kör OCR* button would describe a system the requirement does not. |
| 14 | **Whether the stages are named** | FD-001, FAI-003, FAI-004, FAI-001 are each discharged between choosing a file and seeing the form | Four named stages, each tagged | An unlabelled progress bar asserts four mandatory requirements. Naming them shows the work instead. `UPLOAD_PIPELINE` in `lib/domain/upload.ts` holds the order and the requirement; the labels are in `lib/i18n/`. |
| 15 | **The file the officer picks** | FA-018: "Agreement name not stated in the protocol: the system uses the **file name** … as identification input" | Real file, real name and size, carried into the protocol pane and shown as identification input | FA-018 cannot be demonstrated at all without an upload — it was previously only described, in the validation sentence. `identificationName()` drops the extension, because the extension is not part of the name. |
| 16 | **What happens to an unreadable file** | FAI-003 is scoped to *scanned* documents | `.pdf/.tif/.tiff/.png/.jpg` accepted; anything else refused with an `error` callout | A `.docx` is not refused because it is hard to read but because accepting it would claim an OCR path the requirement does not describe. Drag-and-drop bypasses the input's `accept`, so the check is real rather than cosmetic. |
| 17 | **Honesty about the prepared extraction** | — | The uploaded file's name and size are real; the protocol text is prepared, and the annotation layer says so | The alternative — refusing arbitrary files and offering a pick-list — is safer but removes the affordance US-01 names. A `Rationale` is the right home: it is not needed to do the task, and CLAUDE.md's tie-break sends it there. |
| 18 | **Whether it is a wizard step** | §4.1 "Quick registration"; US-01's alternative flows are non-linear | One page. Before a file, only the upload; after, the two-pane layout | Same reasoning as the stepper itself. Step 1 and the protocol pane share the `steg-protokoll` anchor, because a step is a step in MI's process, not a panel on our screen. |

## Consequences elsewhere

- `registrera.document.fileName` is gone from both dictionaries. The pane reads the
  uploaded file's name, so a hardcoded one would be another superseded leftover.
- `scripts/screenshots.mjs` uploads an in-memory PDF before capturing `/registrera`,
  under the same file name the pane always carried, so the captures stay comparable
  with the ones taken before step 1 existed. A new shot, `registrera-uppladdning`,
  covers the upload itself.
- `/dokument` still has an inert **Ladda upp dokument** button. That is FD-001's
  general document flow — any type, linked to any entity — and is a different screen,
  not a smaller version of this one.
