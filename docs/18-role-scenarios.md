# The three scored role scenarios — response text

*Drafted 2026-08-21. Plan item 2 of `docs/17-scenario-criterion.md`.*

This is the text for the tender response's most heavily weighted section,
*Rollbaserade användarscenarier och användargränssnitt* (**SEK 1 000 000 of
2 500 000**). The criterion asks for four things about each of three roles:

1. the user's **task and goal**
2. the **workflow** for the scenario
3. **visualisations** of the interface
4. how the solution supports **usability, efficiency and accessibility** for that role

Everything below is written against what the prototype actually does. Where
something is described rather than built, the text says so — a bid that claims
everything is already true invites the one question it cannot answer.

> **This draft is English; the response is Swedish.** Every MIIS term is given in
> Swedish so the translation is mechanical, and the screenshots are already
> Swedish, which is what the evaluator looks at. Budget an afternoon for the
> rendering, not a rewrite.

**Screenshots** are generated from the running build by `npm run screenshots` —
never redrawn, never touched up — in two passes: `--produkt` (the system as MI
would use it) and `--kravid` (the same screen with requirement IDs shown, for
tracing requirement → interface). File names below are the `produkt` pass.

---

## 1. Agreement Administrator / Case Officer

*Avtalsadministratör. In the prototype: Anna Andersson, Analysenheten.*

### Task and goal

A signed agreement protocol arrives at Medlingsinstitutet, normally as a scanned
PDF from one of the parties. The case officer's task is to get it into the
register: identify which agreement it concerns, register the wage agreement and
the general terms, and link the document.

The goal is **a correct, complete and traceable registration** — and correctness
is what the role is measured on, not speed. Everything downstream reads what the
officer typed: the Short-Term Wage Report that goes to SCB, the Bargaining Round
Report, the Agreement Constructions report, MI's annual report, and every answer
MI gives a journalist. A wrong cost frame here is a wrong figure in a published
statistic eighteen months later. §2.5 of the requirement specification says the
current system loses time to exactly this: information that has to be
re-registered in several places, and reports that cannot be trusted without
manual checking.

### Workflow

The registration follows **MI's own user flow from Appendix 1 §4.4**, unchanged —
five steps, shown as a stepper that stays visible so the officer always knows
where they are and what remains.

**Step 1 — Upload.** The officer starts from a primary action on their start page
(*Ladda upp avtalsprotokoll*); registration is an action, not a menu destination.
The protocol is dropped or chosen. Four things then happen automatically and are
reported as they complete: the document is received and linked to the agreement
(FD-001), scanned text is OCR-interpreted (FAI-003), the watchword table is
searched (FAI-004), and the content is matched against existing agreements.

**Step 2 — AI analysis.** The proposals appear in a compartment that is
unmistakably the machine's rather than MI's: a banded header, the `AI` mark, a
violet spine, and a standing sentence stating that nothing is saved until a case
officer has approved it (FAI-002). Every proposal is **source-linked** —
selecting it highlights the passage in the protocol it was read from (FAI-001,
FAI-004) — so review is reading two things side by side rather than trusting a
value.

The officer approves, adjusts or rejects each proposal. **The demo deliberately
contains a wrong one**: the extraction picked a confederation where the protocol
names *Unionen*, which is the near-miss a real model makes on Swedish party
names. Showing only the happy path would assert human review; showing the
correction demonstrates it.

**Step 3 — Agreement (matched).** The pre-filled head registration: agreement
name, alternative name, the two parties, agreement type (FA-001). MI registers
one agreement per party (§4.2), and the interface follows that rather than
flattening it.

**Step 4 — Wage agreement and general terms.** Agreement construction, one of
MI's seven, ordered by bargaining level (FA-007); wage scope and cost frame
(FA-008); individual guarantee (FA-010); working-time reduction and its cost
(FA-009); wage revision date and percentage; minimum wage per occupational group
(FA-013); the gender-equality flag where a wording has been identified (FA-011);
the industry benchmark flag if the agreement is norm-setting (FA-012). General
terms are registered with **their own validity period**, because in Sweden the
two periods routinely differ (FA-004).

**Step 5 — Link and save.** The protocol is linked to the agreement, the wage
agreement and the negotiation (FD-001, FF-002). The officer saves the
registration as complete, or as **Ofullständig** (FA-021) when the protocol does
not contain everything — a first-class state, not a failure, so nobody has to
invent a value to escape the form. A confidentiality marking can be set here
(D-001).

**Afterwards.** The agreement is in the register, in search and in the reports.
The change log holds who approved what and when, **with the old and the new
value** (FH-001) — which is what makes the AI guarantee checkable after the fact
rather than merely promised.

The role's other work is reachable from the same shell: the agreement register
and the agreement view (FA-005, FA-006, FA-019), the party register with name
history (FP-001–FP-006), Märket as a reference (FM-003), and the report extract.

### Visualisations

| File | Shows |
|---|---|
| `registrera-uppladdning` | Step 1 — the upload and the four automatic stages |
| `registrera-protokoll` | Steps 2–5 — the protocol pinned beside the form |
| `registrera-protokoll-kallkoppling` | An AI proposal source-linked to its passage |
| `ai-assistenten` | The AI support: what can be asked for here, and what awaits approval |
| `avtalsregister` | The agreement register with FR-012 status and filters |
| `avtal-huvudrapport` | One agreement in full — Bilaga F's Rapport 4, on screen |
| `rapporter-urvalsbild` | The report selection screen, in MI's own shape |
| `start-avtalsadministrator` | The role's start page |

### Usability, efficiency and accessibility

**Usability.** The protocol stays beside the form while the officer scrolls, so
checking a value is a glance rather than a scroll up and back — the single
biggest time cost in the current way of working. A field's width tells the
officer what belongs in it: a date or a percentage is short, a name is wider,
free text is the row. The unit lives in the label and the box holds a bare
number (*Löneutrymme (%)* with `3,4`), so nothing has to be decided about the
sign and nothing is stored that a report cannot sum. Controls that are not
available say why on themselves rather than failing silently.

**Efficiency.** Five steps, MI's own, with no invented ones. The AI support
pre-fills what it can read and marks the watchwords MI set before the round, so
the officer's attention goes to the clauses that matter instead of to
transcription. An incomplete registration is savable and generates a reminder,
so a protocol that arrives with a gap does not block the queue. The Short-Term
Wage Report is written out from a view that already knows which agreements have
been exported before, so nothing is delivered twice.

**Accessibility.** WCAG 2.1 AA is a requirement (NFUI-003), and is verified
rather than claimed: axe-core runs across every route in both languages at eight
widths on every change, currently **0 violations**, with no horizontal scroll
anywhere between 375 px and 1920 px. Every interactive element has a visible
focus state and a target of at least 44 × 44 px. FR-012's colour coding always
carries a shape and a word as well as a colour, so the status of an agreement
survives greyscale, a projector and colour blindness. Every icon is decorative
in the accessible sense, with the meaning in the label beside it. The typeface is
Public Sans, drawn for government forms, self-hosted so that NFA-001's ban on
external cloud dependencies holds, with tabular figures that keep columns of
dates and percentages aligned.

---

## 2. System Administrator

*Systemadministratör. In the prototype: Lars Lund, IT och förvaltning.*

### Task and goal

The system administrator is accountable for the system rather than for the case
work in it. Their question is: **what has this system done, and can MI answer for
it without asking the supplier?**

Three concrete tasks follow from that. When a figure in a published report is
questioned, reconstruct who changed it, when, and what it was before. Before a
bargaining round, make sure the watchword table carries the terms MI wants
surfaced in incoming protocols. And be able to demonstrate, to MI's own
management and to an auditor, that the logs are retained and reachable without
the supplier's involvement.

### Workflow

**Reconstructing a change.** The administrator opens Administration. The
**ändringslogg** (FH-001) shows time, user, object, field, **and both the old and
the new value** — the difference between a log that records that something
changed and one that can reconstruct what it was. The columns sort, so the
question "what did Anna change on the twelfth" and the question "what has ever
been done to agreement A-006" are the same table read two ways. Because the log
holds the AI's proposal and the officer's correction as separate entries, FAI-002's
guarantee is checkable after the fact rather than merely stated at the time.

**Maintaining the watchword table.** FAI-004's table is here, showing MI's
predefined terms and the terms promoted from party meetings, distinguished from
each other. It is maintained before the round; what is in it decides what the AI
analysis marks in every protocol that arrives afterwards. This is the clearest
example in the system of an administrator's setting having a visible effect on a
case officer's day.

**Demonstrating retention and access.** The **händelselogg** (FH-002) carries
high-level events and the notifications the system has sent. NFL-004 asks for
access *"via ett administrativt gränssnitt eller exportfunktion utan att behöva
kontakta leverantören"* — the interface is this screen, and the export that
actually runs is the print, which carries MI's mark and an *Utskriftsdatum* the
way their own printouts do.

**Configuring the system.** §3.1 gives this role *"systemkonfiguration (exkl.
behörigheter)"*, and the settings panel is where that happens. Four settings, and
the interesting part is that **two of them are deliberately not editable**:

- **The session time limit** (NFÅ-002) is genuinely configurable, and configured
  here changes the behaviour everywhere: set it to ten minutes and the start page
  says ten, and the inactivity warning arrives at eight. The field refuses a
  value above thirty — NFÅ-002's own number — because a longer limit weakens the
  requirement rather than configures it, and it says so when refusing.
- **The watchword table** (FAI-004) is the example US-13 names, and is maintained
  in the table below.
- **Log retention** is shown with a padlock and its reason. NFL-003 names this
  role in the prohibition — *"ska inte kunna ändras eller raderas av vanliga
  användare **eller systemadministratörer**"* — so a field an administrator could
  shorten would contradict the sentence that created it.
- **The public IP restriction** (NFÅ-006) likewise: it lives in
  Försäkringskassan's operation of the environment, and a field here would imply
  that MIIS could open itself up.

Showing the two that are fixed beside the two that are not is the point of the
panel. Four editable boxes would say we built a settings form; this says we read
the sentences.

**Authorisation is deliberately not here.** NFÅ-005 places *upplägg och redigering
av användare och rolltilldelning* with MI's own authorisation administrator, and
the system administrator's own permission row on the matrix says so. Separating
the two is the point: the person who can change the system is not the person who
can grant access to it.

### Visualisations

| File | Shows |
|---|---|
| `administration-loggar` | System settings, change log with old and new value, event log, watchword table, retention |
| `start-systemadministrator` | The role's start page and its full menu |
| `anvandare-behorigheter` | The authorisation matrix this role can read but not edit |

### Usability, efficiency and accessibility

**Usability.** One screen answers the role's question, because the two logs, the
support table and the retention statement are four parts of one subject — what
this system has done. Long tables pin their header and scroll inside their own
region, so the column names do not disappear after eight rows. Nothing on the
screen is editable that should not be: the log states in its own words that it is
written by the system and cannot be edited from here.

**Efficiency.** Sorting by time, user or object turns one table into the several
questions an administrator actually asks. The watchword table distinguishes
predefined terms from those added at a party meeting, so an administrator
preparing for a round can see at a glance what has accumulated since the last
one. A setting that is refused says which way it is wrong and what the limit is,
so the administrator does not have to guess at an allowed value. Printing gets
the answer out of the system without a support ticket.

**Accessibility.** The same guarantees as every other role — AA verified by
tooling on every change, keyboard reachable, no meaning carried by colour alone.
Two things matter particularly here: the tables are wide, and they scroll inside
a focusable, named region so a keyboard user can reach them at all (WCAG 2.1.1);
and figures are tabular, so a column of timestamps reads as a column.

---

## 3. The Public Access Computer

*Publik dator. In the prototype: an unnamed visitor, no account.*

### Task and goal

A visitor comes to Medlingsinstitutet's premises — a journalist checking a claim,
a student, an employee wanting to know which agreement covers them. They want to
know **which agreement applies to a given area, what period it runs to, and
whether it has been renewed**, and to take the answer away with them.

They have no account, no training and no second attempt. This is the role where
the interface has to be right the first time, and it is the role whose needs are
least like the case officer's.

### Workflow

**Arriving.** The public computer opens directly on the public view. There is no
sign-in and there should not be: NFÅ-001 puts staff authentication in
Försäkringskassan's IdP with an EFOS card, and NFÅ-006 restricts public access to
Medlingsinstitutet's own IP address — so the machine in the room *is* the
credential. The view is visually marked as a public view, so nobody mistakes it
for the internal system.

**Finding the agreement.** The first control is a single search field. The
visitor types what they came in knowing — an agreement area, a union, an employer
— and the list narrows as they type, matching the agreement's name, its area and
both parties (FR-001, FR-003). Nothing has to be chosen from a list first, and
nothing has to be pressed.

Underneath it are **MI's own three criteria** — employer organisation, employee
organisation, agreement — read off the selection screen for *Avtal –
Allmänheten* in Appendix 1's Bilaga F, for the visitor who knows exactly which
agreement they want. A fourth narrows to the agreements that were in force at a
given date (FA-020), which is the question a visitor checking a past year asks.
Whatever is narrowed appears as a removable chip with a count, and any field left
as *Alla* means it was not narrowed — which the result then states in a sentence
rather than leaving the reader to guess at the population.

**Reading the result.** The agreements in the selection, with parties, agreement
area, the validity period of the wage agreement and of the general terms, and the
agreement's status under FR-012 — carried as a colour, a shape *and* a word.

**Taking it away.** The result prints (FR-011). The printout is a document, not a
screenshot: it carries Medlingsinstitutet's mark and an *Utskriftsdatum* the way
MI's own printouts in Bilaga F do, and it drops the navigation, the header and
every annotation. Printing is the one export that needs no server, so it is the
one that actually runs in the prototype.

**What the visitor may not see.** Confidentiality-marked agreement information is
excluded (FR-011, D-002, NFÅ-004) — and excluded **in the markup**, not by a
stylesheet. A value hidden by CSS is still in the document; a requirement about
what may leave the building cannot be met by not painting it. Where something is
withheld, the view says so rather than leaving a blank, because an empty field
reads as missing data and a marked one reads as withheld data, and those are
different facts.

**Why there is no query builder here.** Bilaga 3 §4.1 records that MI's *current*
public interface offers three ways in — via ärendekort, via the search builder,
and free-text search. Free text is here, and the report is here. The **search
builder deliberately is not**, and the reasoning is on the screen rather than
left to be noticed: W3D3 offers it to the public because W3D3 is a generic diary
product whose public interface was *configured* rather than designed, and
Avropsförfrågan §18.3 is explicit that the old system is not the starting point
for the new one. FR-002's builder is field × operator × value with and/or, nested
groups, chosen presentation columns and saved searches — an expert instrument,
handed to someone with no sign-in, no introduction and one attempt. What it would
answer, the search field and three criteria answer in one step.

It is a decision, not an omission, and it is reversible: should MI want the
builder in the public view, it is the same component, and `maySeeConfidential`
already decides what it may return.

### Visualisations

| File | Shows |
|---|---|
| `allmanheten` | The whole role: search, selection, result, status coding, print |

### Usability, efficiency and accessibility

**Usability.** One screen, one search field, one result. No menu, no login, no
internal vocabulary, and nothing that can be edited. The visitor is never asked to
choose from a list before they can begin — they type, and what they typed appears
above the result as a removable chip so it is always clear what the list is a list
*of*. Everything needed to understand the answer is on the same page as the
answer: what a colour means is written beside it, and what was *not* narrowed is
stated rather than implied.

**Efficiency.** The common case — "which agreement covers this area" — is one
word, with no button to find and no page to wait for; the result narrows as the
visitor types. The precise case is one dropdown. The result prints without a
dialog or a download, and an empty result offers the way back rather than leaving
the visitor at a dead end.

**Accessibility.** This is the role where accessibility stops being a compliance
exercise. The visitor may be using MI's computer at 200 % zoom, with a screen
reader, or with a colour vision deficiency, and there is no colleague to ask. The
view is verified at every width from 375 px to 1920 px with no horizontal scroll,
carries **0 axe violations**, keeps every control keyboard-reachable at 44 × 44 px
or larger, and never uses colour as the only carrier of meaning — the FR-012
status is a colour, a distinct shape and a word together. Text contrast is at
least 4.5:1 throughout and non-text indicators at least 3:1, measured rather than
estimated.

---

## What this section should not claim

Three things, stated here so they are not accidentally claimed above.

**The prototype has no database, no identity provider and no AI model.** The
registration flow, the AI proposals and the logs are real interfaces over sample
data. Everything downstream of a real backend — migration, integration tests,
production verification — is delivery work and is described in the *Arbetsprocesser
och metoder* section instead.

**The eight roles are implemented; three are presented.** Appendix 1 §3.1 defines
eight, NFÅ-003 requires all of them, and the prototype has all of them with
per-screen read/write authorisation. The mediation administrator, the mediator
administrator, the statistics user and the authorisation administrator are worth
showing as evidence that the system is complete — but the three above are what
this criterion is marked on, and they go first.

**The current system is not the model for the new one.** Avropsförfrågan §18.3 is
explicit: *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen
av det nya systemet."* Where this prototype follows MI's existing material it
follows the **information** — the report criteria, the five-step flow, the field
definitions — and not W3D3's interface.
