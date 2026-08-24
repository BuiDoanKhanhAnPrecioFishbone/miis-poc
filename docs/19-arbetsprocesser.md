# §3.4 Arbetsprocesser och metoder — response text

*Drafted 2026-08-21, against Bilaga 2 §3.4.*

MI's requirement, in full:

> *"Ramavtalsleverantören ska ha relevanta arbetsprocesser och metoder för att
> utföra uppdraget och dess olika delar. Ramavtalsleverantören ska beskriva hur
> uppdraget avses utföras; **vilken arbetsprocess/metod** som kommer att
> användas, **hur ni avser samarbeta med Medlingsinstitutet** samt en
> **övergripande tidplan** för uppdragets olika delar."*

Three things, so three sections. This is a **ska-krav**, not a scored criterion —
§16 scores only the role-based scenarios — so the bar is *credible and complete*
rather than *impressive*. What makes it credible is that the method described
here is the method this response was produced with, and the evidence is
checkable: `docs/16-verification.md` maps every claim to a command that runs.

> **This draft is English; the response is Swedish.** Swedish terms are given as
> they will appear, so the translation is mechanical.

> **Two placeholders only**, both marked `[…]`: the named consultants and their
> CVs belong to §3.1, and the hour estimates belong to Bilaga 4.

---

## 1. Arbetsprocess och metod

### Iterative delivery in two-week increments

The assignment is delivered in **two-week increments**, each ending in software
MI can open and use — not in a status report. Steg 1 is roughly six months from
contract to the 1 April 2027 deadline, and a plan that shows MI the system once,
near the end, gives them no way to correct course while correcting it is still
cheap.

Each increment ends with:

- a **working build at a URL** MI can click through, with the increment's
  requirement IDs visible on the screens that satisfy them;
- a **review** with MI at Drottninggatan 89 (see §2), where the increment is
  demonstrated and the next one is planned;
- an updated **requirement status** — which Ska-krav are met, which are in
  progress, which are untouched.

The backlog is Bilaga 1's own requirement tables. We do not restate MI's
requirements in our own words and then build against the restatement: the
requirement ID is the unit of work, so *FA-002 is done* means the same thing to
MI and to us.

### Requirement traceability, built into the product

Every screen carries the IDs of the requirements it satisfies, behind a toggle
that is off by default. T-006 asks that *"samtliga ska-krav ska verifieras och
godkännas av Medlingsinstitutet innan slutleverans"*, and approval of that kind
needs a walk from the requirement to the interface. The layer that makes the walk
possible is part of the system rather than a document maintained beside it, so it
cannot go stale.

**The prototype accompanying this response already works this way**, and the
screenshots in the role-scenario section are generated from the running build —
never redrawn, never touched up.

### Quality gates that run on every change

Not a test phase at the end. Each of these runs on every change and blocks a
merge if it fails:

| Gate | What it protects |
|---|---|
| **Unit tests over the domain layer** | The rules — authorisation, status, report selection, publication, the query builder's own composition, the AI's boundaries. Currently **362 tests** |
| **Architectural lint rules** | The data seam. An import of the data layer from a screen fails the build, so the mock→database swap stays invisible to the interface |
| **Type-checked translations** | The second language cannot silently rot: a missing or misspelt key fails compilation |
| **Referential integrity at build** | A dangling reference in the data fails the build rather than showing an empty screen |
| **WCAG 2.1 AA sweep** | NFUI-003, as a gate rather than a review. `npm run audit` runs axe-core across every route as every role, exits non-zero on any finding. Currently **0 violations**, and no horizontal scroll between 375 px and 1920 px |
| **No specification text in the product view** | The same command scans every route with the requirement tags off for requirement IDs, § references and appendix names. A system MI will use does not argue with its user about the specification. Currently **0** |
| **Named scenarios, run against the build** | `docs/21-definition-of-done.md` carries twelve, written so a failure is unambiguous — that every act ends on what it produced, that every derived count moves, that a printout is a document, that confidentiality-marked information is not served at all |
| **Screenshot pass** | The tender document and the running system cannot drift apart |

`docs/16-verification.md` maps MI's chapter 9 — T-001 to T-008 — to what is
verified today and what is delivery work, requirement by requirement, and is
honest about which is which.

### Architecture that keeps MI's ownership real

§3.7 gives MI the system outright — source, documentation, database structure,
integrations and configurations — *"med rätt att fritt använda och
vidareutveckla det utan beroende av en enskild leverantör"*. That is an
architectural obligation, not a licensing one, and three decisions carry it:

- **A pure domain layer that imports nothing.** MI's rules — the eight roles and
  their permissions, the seven agreement constructions, FR-012's statuses, the
  report criteria — live in code that depends on no framework and no vendor.
  It survives a change of both.
- **One data seam.** Every read goes through a single layer, so the storage
  underneath can be replaced without touching a screen.
- **No external cloud dependencies.** NFA-001 names Google Cloud specifically;
  the prototype self-hosts its typeface and has no CDN, no external font
  service, no third-party analytics. Nothing leaves MI's environment at build or
  at run time.

### Definition of done

An increment is done when the requirement's acceptance is demonstrable in the
running system, the tests for its rules exist and pass, the accessibility sweep
is clean, the change log records it, and MI has seen it. "Code complete" is not
a state we report.

---

## 2. Samarbete med Medlingsinstitutet

### The working group

A dedicated working group per §3.1, named in the response with CVs attached:
`[named consultants and CVs — §3.1]`. The same people for the duration; a
project of six months with a fixed end date cannot absorb turnover.

MI's project manager and ours **jointly lead** the project meetings (§2.2), and
ours is reachable between them as a sounding board for questions that will not
wait (§2.3).

### Meeting cadence

| When | What | Where |
|---|---|---|
| Project start | **Uppstartsmöte** — working group introduced, environments agreed with Försäkringskassan, backlog walked against Bilaga 1 | Drottninggatan 89 (§2.1) |
| Every two weeks | **Demonstration and planning** — the increment shown in the running system, the next increment agreed, requirement status updated | Drottninggatan 89 (§3.3) |
| Weekly | **Short check-in** — progress, blockers, decisions needed | Digital (§3.3) |
| As needed | **Sounding board** for MI's project manager | Digital or telephone (§2.3) |

All project meetings are physical and at MI's premises, per §2.1 and §3.3.
Shorter check-ins and questions are digital, which is what §3.3 permits and what
keeps a two-week cadence practical.

### Who decides what

Stated plainly, because an unclear answer here costs weeks later:

- **MI decides** requirement priority, what an increment must contain, what
  counts as accepted, and every question of substance about collective
  agreements and mediation. We ask rather than assume — the domain is MI's, and
  a supplier who guesses at *avtalskonstruktion* or *informationsbegränsning*
  produces a system that has to be corrected after delivery.
- **We decide** technical design, and we write down why, in the code. Every
  non-obvious decision in the accompanying prototype carries its reasoning where
  the next developer will find it — which is what makes §3.7's *vidareutveckla*
  possible for someone who was not there.

### Collaboration with Försäkringskassan's IT

§2.5 requires it, and four requirements depend on it, so it starts in the first
weeks rather than at integration time:

- **NFÅ-001** — authentication over SAML 2.0 against Försäkringskassan's EFOS
  IdP. The prototype deliberately has **no login screen**, because drawing one
  would claim we had built the identity provider.
- **NFÅ-006** — the IP restriction for the public computer, which lives in the
  operating environment rather than in MIIS.
- **NFL-003** — log retention, which the system must not be able to shorten.
- **L-001** — the continuity plan, backup and restore routines.

We propose a joint technical session with Försäkringskassan's IT department in
the first two weeks, and a standing channel after it.

### The temporary development environment

§2.6: if Försäkringskassan's environment is not available at project start, we
set up and run a temporary development environment so the start is not delayed.
As soon as Försäkringskassan's environment is available, **all development moves
there and every piece of data traceable to MI is deleted** from the temporary
one. The cost is estimated separately in Bilaga 4 and is not in the fixed price,
per §2.6.

### Acceptance testing

Per §9.2, acceptance testing is with **MI's own users and covers every user
role** — not a demonstration to a project group. We provide the UAT environment
(T-005), MI verifies and approves every Ska-krav before final delivery (T-006),
and the migration is verified for data quality and completeness (T-007) before
production verification after go-live (T-008).

---

## 3. Övergripande tidplan

The dates that are fixed, and everything else follows from them: tilldelnings-
beslut **2026-09-08**, last day for appeal **2026-09-22**, contract after the
standstill period, and **Steg 1 finished before 2027-04-01** (§3.2).

That is approximately **six months**, or thirteen two-week increments. The plan
below assumes a start in early October 2026.

### Steg 1 — to 2027-04-01

| Period | Part of the assignment | Ends with |
|---|---|---|
| **Oct 2026, weeks 1–2** | **Uppstart.** Uppstartsmöte, working group in place, environments agreed with Försäkringskassan, backlog against Bilaga 1's requirement tables, **migration analysis of W3D3 begins** | Agreed increment plan; environment decision under §2.6 |
| **Oct–Dec 2026** | **Kärnregistrering.** The agreement and party model, registration of löneavtal and allmänna villkor, the party register with name history and mergers, document upload and linking, the change and event logs | The registration flow MI's §4.4 describes, end to end, on real data structures |
| **Nov 2026–Feb 2027** | **AI-stöd**, in parallel. §4.1's four functions against Försäkringskassan's model service | Each function demonstrated with approve and reject, per FAI-002 |
| **Jan–Feb 2027** | **Sökning, rapporter och medling.** Composite search with historical reconstruction, Bilaga F's reports with their own selection screens, mediation cases and party meetings | Reports that produce MI's own printouts |
| **Dec 2026–Mar 2027** | **Migrering** from W3D3, in repeated trial runs rather than once at the end (NFM-001, NFM-003) | Migration verified for quality and completeness (T-007) |
| **Mar 2027** | **Acceptanstest och driftsättning.** UAT with MI's own users across every role, corrections, go-live, production verification | Leveransgodkännande in writing (§14) |

**Steg 1 delivers what the bargaining round needs**: registration, search and
reporting for löneavtal and allmänna villkor, plus mediation. That is MI's own
scope split in §1.3, not ours.

### Steg 2 — from autumn 2027

Planned jointly with MI, per §3.2. Pension agreements, insurance and other
agreement types; migration of the Access database (NFM-002); external access for
mediators via Bank-ID. Priced as an estimate of hours and hourly rates in
Bilaga 4.

### Steg 3 — the option

Support, maintenance and continued development, 2 years with 2 + 2 years'
extension, per §15 of the avropsförfrågan. Fixed price for support and
maintenance; development at the same hourly rates as the project.

### The risks that could move 1 April 2027, and how the method handles them

Named, because a plan that does not name them is a plan nobody has tested.

**The deadline is not negotiable — the bargaining round is not going to move.**
The protection is MI's own two-step split, used the way it was intended: we
deliver in requirement priority order, so that if anything slips it is a Steg 2
item and not the registration of a wage agreement. Every increment is shippable,
so at any point there is a working system rather than a half-integrated one.

**Dependence on Försäkringskassan's environment.** §2.6's temporary environment
exists precisely for this, and the joint technical session in the first two
weeks is intended to find the problem while there is still time to route around
it.

**Migration data quality from W3D3.** Analysis starts in the first increment and
migration runs repeatedly from December, not once in March. A migration first
attempted at the end of a fixed-date project is the most common way such a
project misses its date.

**Availability of the AI model service.** The AI is deliberately **not on the
critical path**. §4.1 requires that every proposal is reviewed and approved by an
officer before anything is saved, so the manual path has to exist for every one
of the four functions regardless — the AI shortens the work rather than enabling
it. If the model service is delayed, registration still works.

---

## What this section should not claim

**The accompanying prototype is not the delivered system.** It has no database,
no identity provider and no AI model. What it demonstrates is the interface, the
rules and the method — and the method is the claim §3.4 asks about.

**The numbers above are current and will move.** 362 tests and 0 accessibility
violations are true of the build this response was generated from; they are
evidence that the gates exist and run, not a promise about a final count. The
gates have earned their place: the most recent thing they caught was a query
builder whose criteria composed correctly and then returned every agreement
regardless — found by running the scenarios, not by looking at the screen.

**The timeline is an outline, not a project plan.** §3.4 asks for *en
övergripande tidplan*. The detailed plan is agreed with MI at the uppstartsmöte,
which is where §2.1 puts it.
