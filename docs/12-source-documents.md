# Source documents, and what they change

Two documents were added to `docs/requirements/` on 2026-08-18. Both are **standing
references** — check work against them the way you check against the requirement spec.

| Document | Searchable text | What it is |
|---|---|---|
| `MIIS_Bargaining_Process_Guide_EN.docx` | `bargaining-process-EN.txt` | Domain guide: the Swedish bargaining round phase by phase, MI's statutory role, and a mapping from process phase → MIIS menu → scenarios |
| `MIIS_Information_Model_EN_1.docx` | `information-model-EN.txt` | The logical information model — 34 entities across five domains — and the physical SQL Server schema it becomes |

The `.txt` files are extracted from the `.docx` for grepping, the same arrangement as
`requirements-v2.5-EN.txt`. Regenerate with the script in the scratchpad if the `.docx`
is updated; the `.docx` is authoritative.

---

## What they confirm

Worth knowing, because several were decisions we argued from first principles and can
now cite instead:

- **Colour coding is derived, never stored** (model §4.6): *"red when a MediationAgreement
  link exists or the agreement was signed after mediation … This guarantees consistency –
  the status can never be 'forgotten'."* This is precisely the bug fixed in `ccf889f`,
  where the mediation view hardcoded `after-mediation` and contradicted the agreement
  tables. `agreementStatus()` is the right shape.
- **Snapshots are temporal, not a separate archive** (model §4.1). `getAgreement(id, at?)`
  already carries the `at` parameter for exactly this.
- **Confidentiality lives on both agreement and document** (model §4.3), with the document
  inheriting. `lib/data/documents.ts` re-derives it from the agreement — right.
- **Party meetings are before/during/after** (guide §3.2, model `PartyMeeting`), which is
  the three-mode tab set already logged in `docs/10-action-inventory.md`.
- **The FO-avtal indicator is decision-critical** (guide §2, §3.4): MI *may not* appoint
  mediators against the will of parties covered by one. Our `/medling/[id]` panel leads
  with it, which the guide confirms is the right prominence.
- **The seven constructions exist because of "dialogue agreements"** (guide §4) — local,
  figure-less wage setting. Useful framing for the oral presentation.

## What they correct

**The navigation.** The guide's chapter 5 prescribes the menu as *Avtal · Parter ·
Förhandlingar · Medling · Partsträffar · Medlare · **Sök & Rapporter** · Märket ·
Administration*, and spec §5.1 (quoting Appendix 1 §4.3) lists **"Search & Reports" as a
single module**. We had split them into two top-level items during the update-plan work —
an over-reading of the module list. They are now one heading with `Rapporter` and `Sök`
nested under it, the same shape as `Medling`. Fixed.

`Dokument` stays a top-level item: §4.3 lists "Document management" as its own module,
even though the guide's shorter list omits it.

---

## Model divergences — for week 2, not for the freeze

The information model is the schema the delivered system will have. Our `lib/domain/`
was written from the requirement tables and differs in two places. Both are **invisible
in the UI** and neither is worth churning three days before the design freeze, but they
should be corrected before the domain layer is handed over (NFU-002).

### 1. Wage-agreement fields sit one level too high

The model puts the following on **`WageRevision`**, a subgroup of the wage agreement:

> *WageRevision (Lonerevision) — Subgroup of the wage agreement: revision date, **agreement
> construction 1–7, wage increase scope, individual guarantee, working time reduction**.
> FA-007–010*

…leaving `WageAgreement` with *"its own validity period and cost frame"*. Our
`WageAgreement` carries `construction`, `wageScopePercent`, `individualGuarantee` and
`workingTimeReduction` directly, with `wageRevision` reduced to a `{date, percent}` pair.

### 2. Two flags belong to the agreement, not the wage agreement

The model puts *"gender equality and industry benchmark flags"* on **`Agreement`**
(FA-011/012), matching FA-011's own wording, *"gender equality flag **per agreement**"*.
Ours are on `WageAgreement`.

Note this is **not** a UI error: the CEO's US-01 sketch places the gender-equality switch
in the *Löneavtal* panel, and US-01's flow sets both flags at that step. A panel is a step
in a flow, not a table. Only the type needs moving.

### 3. The watchword table is an entity, not a flag

The model has **two** entities where we have one boolean:

> `Watchword (Bevakningsord)` — The predefined, customisable watchword table. FAI-004
> `WatchwordHit (BevakningsordTraff)` — Watchword hits in documents with position and
> text excerpt – the basis for highlighting in the UI.

Our `BargainingDemand` carries `watchword: boolean` — "this demand is in the table". MI's
shape is a table of watchwords that demands are promoted *into*, and a separate record of
each hit inside a document, with its position. The UI is the same either way, which is why
the shortcut survived; the difference shows the moment a watchword has to exist without a
demand behind it, or a hit has to be located on a page.

`/registrera`'s "4 träffar" is the other end of the same gap: it is a hardcoded number
where the model wants `WatchwordHit` rows.

### 4. Fields on the party meeting that no requirement defines

`PartyMeeting` carries `purpose`, `agenda`, `participants`, `location` and a
`planned/held/completed` state. FF-004 and the model both describe the meeting only as
*"notes before/during/after (interactive view)"* — none of those five fields is specified
anywhere. They are reasonable for a meeting record and they make the screen legible, but
they are ours, and MI may name different ones.

An earlier version also carried a graded `conflictRisk` of low/medium/high. That went:
US-08 says MI meets a party to *"identify conflict risks and assess where mediation may be
needed"*, so recording a judgement is MI's idea, but the three-level scale was a taxonomy
nobody asked for — the same fault as the AI confidence score removed from `/registrera`.
It is free text now, labelled *Bedömning av medlingsbehov*.

### 5. Entities we have no equivalent for

Not needed for the mockup, listed so the gap is known: `BargainingRound`,
`PartyClassification` (time-bound), `CooperationBodyMember`, `WatchwordHit`,
`SavedSearch` (as stored JSON), `LoginLog`, `EmailLog`, `TermsChange`, `WorkingGroup`,
`InsuranceInformation`.

---

## How to use these

- **Before designing a screen**, read the guide's chapter 5 row for the phase it belongs
  to. It names the scenarios and requirements that screen has to satisfy.
- **Before adding a field or a relation**, check the entity catalogue in the information
  model. If our shape differs, the model wins and the divergence goes in the list above.
- **Physical table and column names are Swedish** (`Avtal`, `Loneavtal`, `PartNamnHistorik`)
  even though the model document uses English entity names. That matches our own rule:
  identifiers English, MI's domain language Swedish.
