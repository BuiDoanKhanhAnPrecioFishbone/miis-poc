# Definition of done — the MIIS bid, end to end

*Written 2026-08-22. This is the consolidated requirement: every source we hold,
how Medlingsinstitutet actually scores the response, what "done" means for each
scored criterion, and the test scenarios that would earn full marks.*

`CLAUDE.md` carries **how to build**. `docs/20-handover.md` carries **what is
true today**. This file carries **what has to be true to win**, and it is the one
to read before planning a bid of this shape again.

---

## 1 · The sources, and which one wins

Seven documents, in four tiers of authority. **When two disagree, the higher tier
wins, and MI's Swedish original always beats our English rendering.**

### Tier 1 — MI's own, binding

| Document | What it settles | Authority |
|---|---|---|
| `tender/Avropsforfragan.pdf` | **How the contract is awarded.** §9 what a complete response is, §13 the dates, §16 the scoring model, §18 the appendices | Absolute |
| `tender/Bilaga_2_Leverantorskontroll.pdf` | **The response itself.** §2 scope acceptance, §3.1–3.7 the seven ska-krav on execution, §4 all Bilaga 1 ska-krav, §5 pricing | Absolute |
| `tender/Bilaga_1_Kravspecifikation.pdf` | **The system.** §3.1 the eight roles, §4.1 the AI's four functions, §4.3 the module sketch, §4.4 the registration flow, §5–6 the requirement tables, §7–9 supplier, data and test requirements, Bilaga A–F | Absolute |
| **Bilaga 4, Prisformulär** | **The price.** Fixed price for Steg 1, hourly rates for Steg 2, the temporary-environment estimate, the per-consultant rates and distribution | Absolute — **and not in this repository** |

### Tier 2 — MI's own, background

| Document | What it settles | Authority |
|---|---|---|
| `tender/Bilaga_3_W3D3_Anvandarmanual.pdf` | **The shape of the information MI keeps** — every registration field, the two published interfaces, the search objects, seven reports, and §7's print-header rules | Binding on *what MI records*. **Never a design template** — Avropsförfrågan §18.3: *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen av det nya systemet."* |

### Tier 3 — ours, second-hand

| Document | Use |
|---|---|
| `requirements-v2.5-EN.txt` | Our Epics, features and the 20 US-* scenarios. Useful as an index; **not authoritative** |
| `bargaining-process-EN.txt` | How a Swedish bargaining round works, phase by phase |
| `information-model-EN.txt` | The 34-entity model the domain layer converges on |

### Tier 4 — working notes

`docs/00`–`docs/20`. Decisions, diffs and state. `docs/13` and `docs/12` record
what has and has not been checked against the originals.

> **Gap to close before the next bid of this shape:** three requirement families
> in Bilaga 1 are **absent from `lib/domain/requirements.ts`** — `L-001…L-008`
> (§7 Leverantörskrav), `T-001…T-008` (§9 Testning) and `D-003, D-005, D-006`
> (§8 Datakrav). They are not interface requirements, so no screen tags them,
> which is defensible — but Bilaga 2 §4 requires accepting **all** ska-krav, so
> the response must answer them in prose even though the prototype cannot show
> them. Nothing currently checks that they are answered.

---

## 2 · How MI actually scores this

### The formula

```
Jämförelsetal = anbudssumma − erhållet mervärde
```

**Lowest jämförelsetal wins.** Mervärde is a discount on the price, not a
tie-break. A full sweep of the quality criteria is worth **SEK 2 500 000 off the
bid price** — which is the only honest way to think about how much a scored
criterion is worth.

### The four criteria

| Criterion | Max mervärde | Where the instruction lives | Our answer |
|---|---|---|---|
| Anbudssumma | — | Bilaga 4 | **Missing** |
| Arbetsgrupp | 500 000 | Bilaga 2 §3.1 | **Missing** — named consultants + CVs |
| Arbetsprocesser och metoder | 500 000 | Bilaga 2 §3.4 | `docs/19-arbetsprocesser.md` (English) |
| **Rollbaserade användarscenarier och användargränssnitt** | **1 000 000** | Bilaga 2 §3.5 | `docs/18-role-scenarios.md` (English) + the prototype |
| Muntlig presentation | 500 000 | Bilaga 2 §3.6 | `/genomgang` — not rehearsed |

### The five bands

| Band | Share of max |
|---|---|
| Mycket högt mervärde | **100 %** |
| Högt mervärde | 75 % |
| Visst mervärde | 50 % |
| Begränsat mervärde | 25 % |
| Inget mervärde | 0 |

There is no partial credit inside a band. The distance between *högt* and
*mycket högt* on the scenario criterion alone is **SEK 250 000**.

### The six judgement factors (Avropsförfrågan §16)

Every criterion is judged on: **relevans · tydlighet · konkretionsgrad ·
genomförbarhet · förståelse för uppdragets förutsättningar · förståelse för
behov.**

Read them as a checklist against each paragraph you write:

- **Relevans** — does this answer what was asked, or what we wanted to say?
- **Tydlighet** — can an evaluator who has read four other responses follow it once?
- **Konkretionsgrad** — is there a name, a number, a date, a screen? *This is the
  factor a working prototype wins outright, and the one prose alone cannot.*
- **Genomförbarhet** — is it credible that this supplier delivers this by
  2027-04-01?
- **Förutsättningar** — do we show we understand Försäkringskassan's operation,
  the EFOS identities, the migration from W3D3?
- **Behov** — do we show we understand the *bargaining round*, not just the software?

---

## 3 · Hard gates — fail any and the response is not scored at all

These are pass/fail, not graded. **A brilliant §3.5 scores nothing if one of
these fails.**

| # | Gate | Source | State |
|---|---|---|---|
| G1 | A complete avropssvar: **filled Bilaga 2 and filled Bilaga 4** | Avropsförfrågan §9 | ❌ Bilaga 4 missing |
| G2 | Submitted by **2026-08-25** | §13 | — |
| G3 | **All ska-krav accepted** — Bilaga 2 §2.1–2.6, §3.1–3.7, and §4 (all of Bilaga 1) | Bilaga 2 §4 | ⚠ L/T/D families unanswered |
| G4 | ESPD self-declaration still correct (Bilaga 2 §1.1–1.2) | §10 | Not ours |
| G5 | Subcontractors declared (Bilaga 2 §1.3) | §11 | Not ours |
| G6 | Response valid **90 days** after 2026-08-25 | §13 | — |
| G7 | Named consultants **with CVs attached** | Bilaga 2 §3.1 | ❌ Missing |

> **G1 and G7 are the same document.** Bilaga 4 is not a formality — without it
> there is no anbudssumma, so there is no jämförelsetal, so there is nothing to
> compare. It is the single highest-risk item in the bid.

---

## 4 · Definition of done — per scored criterion

### 4.1 · Rollbaserade användarscenarier (SEK 1 000 000)

**Bilaga 2 §3.5 names three roles and thirteen bullets.** Done means every
bullet is *shown*, not described.

| Role | Bullets |
|---|---|
| **Systemadministratör** | overview of users/roles/permissions · create a user · assign role and permission · change or revoke · system settings *or other administration the supplier judges central* |
| **Avtalsadministratör / Handläggare** | register a new collective agreement · add or update information · handle versions or changes · publish |
| **Allmänhetens dator** | search by industry/agreement area/other · filter or narrow the result · read the agreement · open and download |

**Four elements are required for each of the three roles** — omitting one on one
role costs a band:

1. A short description of the user's **task and goal**
2. A description of the **workflow**
3. **Visualisations** — *"behöver inte utgöra färdiga systembilder"*
4. A statement of **usability, efficiency and accessibility** for that role

**Done is:**

- [ ] All 13 bullets demonstrable in the running build, each reachable in ≤3 clicks from `/genomgang`
- [ ] All 4 elements written for each of the 3 roles — 12 sections, none thin
- [ ] Every visualisation generated from the running build, never redrawn
- [ ] Screenshots regenerated **after the last UI change** (they go stale silently)
- [ ] The §3.5 vs §3.1 contradiction on user administration answered explicitly, by switching role rather than widening one
- [ ] Zero requirement text in the product view — a system MI will use does not argue with its user about the specification
- [ ] WCAG 2.1 AA verified, not claimed: a number, from a named tool, dated

**MI's own six judgements for this criterion** (§3.5, distinct from §16's six):
how well the solution supports each role's needs · the interface's clarity,
structure and usability · how intuitive the workflows are · **the supplier's
understanding of the business's requirements and working processes** · how well
the visualisations aid understanding · the extent of value created.

> The fourth is the one prose wins and pictures cannot: it is earned by naming a
> constraint MI wrote and explaining why the interface obeys it.

### 4.2 · Arbetsprocesser och metoder (SEK 500 000)

**Bilaga 2 §3.4** asks three things and no more: *which working process/method*,
*how you will collaborate with MI*, and *an overall timeline for the parts*.

**Done is:**

- [ ] A named method, not a genre — with what it produces each iteration
- [ ] Collaboration answered against §3.3's own words: **regular physical meetings at Drottninggatan 89**, shorter check-ins digital
- [ ] A timeline anchored on the two fixed dates: **Steg 1 before 2027-04-01**, Steg 2 from autumn 2027
- [ ] §2.2's requirement that **both project leaders jointly lead** the project meetings
- [ ] §2.5 collaboration with **Försäkringskassan's IT department**
- [ ] §2.6 the temporary development environment — *and its estimate in Bilaga 4, separately from the fixed price*
- [ ] Evidence, not assertion: `docs/16-verification.md` mapped to Bilaga 1 §9

### 4.3 · Arbetsgrupp (SEK 500 000)

**Bilaga 2 §3.1.** Done is:

- [ ] The group described — **what competence each member brings**
- [ ] Consultants **named**
- [ ] **CVs attached**, numbered as appendices
- [ ] Hourly cost per consultant/competence in Bilaga 4
- [ ] **Percentage distribution per consultant type** in Bilaga 4

> Every box here is a hard requirement *and* a graded one. An unnamed group
> cannot score above *begränsat*.

### 4.4 · Muntlig presentation (SEK 500 000)

**Bilaga 2 §3.6.** 15 minutes, at MI's premises, week 35.

**Done is:**

- [ ] A script that runs in **under 15 minutes** with time for questions
- [ ] **Nothing new in it.** *"Leverantören får ej tillföra nya åtaganden, det är inte en möjlighet till en andra anbudsomgång."* Every claim must already be in the written response
- [ ] Rehearsed against a clock, on the machine that will present
- [ ] A fallback if the network fails — the deployed build is not guaranteed to be reachable in MI's building

---

## 5 · Test scenarios — what a full-marks demonstration must survive

These are the walkthroughs to run before submitting. Each is written so a
failure is unambiguous.

### T1 · The thirteen bullets, end to end

For each of §3.5's 13 bullets: open `/genomgang`, follow the step, and confirm
the bullet is **performed**, not read about.

**Fails if:** a control is `disabled`; a control has no `onClick`; the step lands
on a register rather than the record; a panel renders only when its content
already exists.

### T2 · Authorisation, per role, per route

Load every route as every one of the eight roles.

**Passes if:** each role sees only its own menu; a refused screen states the
reason; the AI drawer's queue is filtered by **write** access; no role reaches a
report it was not given by §3.1.

**Automated:** `npm run audit` covers the accessibility half across roles.

### T3 · Accessibility

`npm run audit`.

**Passes if:** 0 axe violations at WCAG 2.1 A/AA across every route × every role,
and no horizontal scroll between 375 px and 1920 px.

### T4 · The product view carries no specification

`npm run audit -- --copy`.

**Passes if:** 0 hits for requirement IDs, § references and appendix names in
`main` with `miis_reqtags=off`. `/genomgang` is excluded — it is reviewer
material and citing requirements is its purpose.

### T5 · Every act ends where it produced something

For each creation or attachment: register a protocol, publish an agreement, set
a reminder, appoint a mediator, register an outcome, add a watchword.

**Passes if:** the confirmation names what happened *and where it went*, and the
control after it opens that thing rather than the list it came from.

### T6 · Every derived number moves

Approve an AI extraction → the drawer's review count falls. Set a reminder → the
start page count rises. Type union members → organisationsgrad recomputes.

**Fails if:** a count that describes something does not change when that thing
changes. *A number that never moves has stopped describing anything.*

### T7 · Print is a document, not a screenshot

Print every screen an officer would print.

**Passes if:** MI's mark and an *Utskriftsdatum with time* (Bilaga 3 §7); no
navigation, header, demo strip or requirement tags; **no controls** except a
sortable column header, a switch and a chosen radio option; fields print as
label-and-value with no placeholders and no hints; a checked box prints as *Ja*;
a two-column screen becomes one column.

### T8 · Confidentiality leaves the building nowhere

As `public` and as `mediator`, request a confidentiality-marked agreement
directly by URL.

**Passes if:** it is not found at all — not rendered-and-hidden. **Fails if** any
withheld value is present in the page source. FR-011 and D-002 are enforced in
the markup, never the stylesheet.

### T9 · Both languages, complete

`npx tsc --noEmit`.

**Passes if:** it compiles. `Dictionary = typeof sv` means a missing or misspelt
English key is a build error — that is what keeps the translation complete.

### T10 · The data is internally consistent

`npm test`.

**Passes if:** 268 tests pass, including `lib/mock/integrity.ts`, which fails the
build on a dangling reference between records.

### T11 · The document describes the system that exists

Re-read `docs/18` and `docs/19` against the running build **after the last UI
change**.

**Fails if:** any screenshot caption, control name or workflow description names
something that has moved. *This has failed twice and both times silently — a
stale document produces no error.*

### T12 · The demo survives the room

Run the 15 minutes on the presenting machine, offline, against the clock.

---

## 6 · Definition of done — the delivery, not the bid

If MI awards the contract, "done" changes shape. Bilaga 1 §9 and Avropsförfrågan
§14 define it.

**Steg 1 — before 2027-04-01.** Löneavtal and allmänna villkor, and everything
the requirement tables mark Stage 1.

**Steg 2 — from autumn 2027.** Pensionsavtal, other agreement types, the
mediator external access option.

**Acceptance (Avropsförfrågan §14):** written approval by MI *after* acceptance
testing per Bilaga 1 §9.2.

| ID | Requirement |
|---|---|
| T-001 | Unit, integration and system tests before go-live, **documented** |
| T-002 | Tested against anonymised or fictitious protocols representing the variation in the Swedish agreement landscape |
| T-003 | Test data includes edge cases — *wholly new agreements with no previous version* |
| T-004 | Regression tests on any update to the system **or the AI model** |
| T-005 | The supplier provides the UAT environment |
| T-006 | **Every ska-krav verified and approved by MI before final delivery** |
| T-007 | Migration verified for data quality and completeness |

> T-006 is the contractual definition of done, and it is why the requirement
> catalogue has to be complete. Verification is per requirement, and a
> requirement nobody wrote down cannot be signed off.

---

## 7 · Where this bid stands, 2026-08-22

**Done and verified:** the prototype (268 tests, 0 accessibility violations, 0
requirement-text leaks, production build clean), `docs/18` audited against the
build today, `docs/19` drafted, 128 screenshots current in both languages,
`/genomgang` walked end to end as every role.

**Blocking, and not ours:**

1. **Bilaga 4** — gate G1 and G7. Without it there is no response.
2. **Swedish rendering** of `docs/18` and `docs/19`. Both are English with the
   Swedish terms already in place, so it is a translation pass — but ~700 lines.
3. **The 15 minutes**, unrehearsed.

**Known and deliberate:** `L-*`, `T-*` and part of `D-*` are absent from the
requirement catalogue (§1); the agreement's list sections, Förhandlingar and a
party's sector/group/industry code remain read-only; `screenshots/` is
gitignored, so the images `docs/18` cites by name exist on one machine only.

---

## 8 · What to do differently next time

1. **Get Bilaga 4 and the CVs on day one.** They are pass/fail gates and they are
   the only items that cannot be produced by the delivery team.
2. **Build the requirement catalogue from the specification, not from the
   screens.** Ours holds **112 IDs** and grew from what the interface needed, so
   the families no screen can show — `L-*`, `T-*`, part of `D-*`, on the order
   of sixteen to nineteen requirements — were never entered. T-006 makes
   completeness contractual, and a requirement nobody wrote down cannot be
   signed off.
3. **Treat the response document as code.** It goes stale silently. `docs/18`
   drifted twice in one week; a check that greps captions against the screenshot
   manifest would have caught both.
4. **Commit the screenshots, or generate them in CI.** Gitignoring the artefacts
   the scored section cites means the response depends on one laptop.
5. **The four criteria are worth 2 500 000 together.** We spent almost all our
   effort on the one worth 1 000 000. Arbetsgrupp and Muntlig presentation are
   worth 500 000 each and neither needs a prototype — they need a named team and
   a rehearsal.
