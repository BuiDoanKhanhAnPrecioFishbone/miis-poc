# The three scored role scenarios — response text

*Drafted 2026-08-21; **rewritten the same day against Bilaga 2 §3.5**, which is
the criterion's own instruction and reached us after the first draft.*

This is the text for the tender response's most heavily weighted section,
*Rollbaserade användarscenarier och användargränssnitt* (**SEK 1 000 000 of
2 500 000**). Bilaga 2 §3.5 asks for four things about each of three roles:

1. *en kort beskrivning av användarens* **uppgift och mål**
2. *en beskrivning av* **arbetsflödet** *för det aktuella scenariot*
3. **visualiseringar** *som illustrerar användargränssnittet*
4. *hur lösningen stödjer* **användbarhet, effektivitet och tillgänglighet**

**§3.5 also prescribes the steps** — five for the system administrator, four each
for the other two — and the three sections below march through them in MI's own
order, so an evaluator reading with the appendix open can tick along.

MI states what it will judge: *"Hur väl lösningen stödjer de olika
användarrollernas behov. Gränssnittets tydlighet, struktur och användbarhet. Hur
intuitivt arbetsflödena är utformade. Leverantörens förståelse för verksamhetens
krav och arbetsprocesser. Hur väl visualiseringarna bidrar till förståelsen av
den föreslagna lösningen. I vilken utsträckning lösningen bedöms skapa mervärde
för användarna och verksamheten."*

And it sets the bar for the visualisations: *"Visualiseringarna behöver inte
utgöra färdiga systembilder utan ska ses som illustrativa exempel."* **Ours are
not sketches.** Every screenshot below is taken from a running, WCAG-audited
system in two complete languages, which an evaluator can click through at
**miis-poc.vercel.app/genomgang** — a guided walkthrough that switches role and
opens each screen, in the order §3.5 scores them.

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

## Scenario 1 — Systemadministratör

*In the prototype: Lars Lund, IT och förvaltning; and Karin Karlsson, the
authorisation administrator. Both, and that is the point — see below.*

### Task and goal

The system administrator is accountable for the system rather than for the case
work in it: **who has access, as what, and what the system has done.** The goal
is that MI can add a new colleague, grant, change and revoke access, and answer
for a questioned figure in a published report — all without contacting the
supplier.

> **This scenario spans two roles, and that is a reading of MI's own documents
> rather than a gap in ours.** Bilaga 2 §3.5 asks the *systemadministratör* to
> create users and assign roles. Bilaga 1 §3.1 gives that role *"full åtkomst
> inkl. systemkonfiguration **(exkl. behörigheter)**"* and places *"läsa, skriva,
> redigera användare"* with the **behörighetsadministratör**. The parenthesis is
> deliberate: it is separation of duties, and it is a security property worth
> keeping — whoever configures the system is not whoever grants access to it. So
> the offered solution demonstrates all five of §3.5's steps and **switches role
> at the point §3.1 requires**, rather than widening a permission MI wrote a
> parenthesis to limit. The walkthrough announces the switch on the control that
> performs it.

### Workflow

MI's five steps, in MI's order.

**1 · An overview of users, roles and permissions.** The authorisation register
answers the four questions such a register exists for, in the order they are
asked: **who** has access, **as what**, **since when and granted by whom**, and
**are they still here**. Each is a column. It filters by role and by status, and
the chips say what has been narrowed.

Permission administration is **three tabs**, because it is three different
things: the register where the work is done, and two references the work is done
against. Under **Roles and permissions** is the **permission matrix** — every one
of §3.1's eight roles
against every module, showing read, write or no access. It is **read-only**, and
that is a design decision rather than an omission: NFÅ-003 defines access by the
roles §3.1 writes down, so a matrix an administrator could rearrange would
describe a local configuration instead of MI's own document, and every
authorisation claim in this response would be about a setting. Roles are the
contract; assignment is the administration.

**2 · Creating a new user.** Name, EFOS identity, e-mail, role. There is **no
password field and no account creation**, because NFÅ-001 puts authentication in
Försäkringskassan's IdP over SAML with an EFOS card — a user in MIIS is a *link*
to an identity that already exists, and drawing an account form would claim we
had built an identity provider.

**3 · Assigning a role and permission.** The role *is* the permission: §3.1 gives
each role a verb, and the role decides what the person sees and may do. The
assignment is stamped with the date and the person who made it, which is the
FH-001 half of NFÅ-005.

**4 · Changing or revoking a permission.** The role is changed **in the row**, so
the administrator has the person, the current role and who assigned it in front
of them while changing it; the new assignment re-stamps the date and the actor.
Revoking is deactivation, not deletion — NFL-001 logs sign-ins and NFL-003 sets a
retention period, so a departed colleague has to go on being resolvable from the
log.

Both actions refuse one case and say why on the control: **the last active
authorisation administrator can neither be moved to another role nor
deactivated.** That is the single lock-out only the supplier could repair, and
NFÅ-005 exists precisely to keep the supplier out of MI's permission
administration.

**5 · System settings and other administration.** §3.1 gives this role
*"systemkonfiguration (exkl. behörigheter)"*. Four settings, and the interesting
part is that **two of them are deliberately not editable**:

- **The session time limit** (NFÅ-002) is genuinely configurable end to end: set
  it to ten minutes and the start page says ten and the inactivity warning
  arrives at eight. It refuses a value above thirty — NFÅ-002's own number —
  because a longer limit weakens the requirement rather than configures it, and
  it says so when refusing.
- **The watchword table** (FAI-004) is maintained before a bargaining round, and
  what is in it decides what the AI analysis marks in every protocol that arrives
  afterwards. It is the clearest case in the system of an administrator's setting
  having a visible effect on a case officer's day — and it is *maintained*, not
  merely displayed: §4.1 calls the table *"fördefinierad **och**
  anpassningsbar"*, and both adjectives are answered. The administrator adds
  terms and removes them again on the **Bevakningsord** tab, and MI's own
  predefined four cannot be removed there, with the reason on the row. A term
  added before the round starts marking text in every protocol that arrives
  after it.
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

Under the settings are the **retention rules for personal data**. D-004 is a
ska-krav with two halves — culling *"i enlighet med Medlingsinstitutets
gallringsrutiner"* and *"möjlighet att definiera automatiska gallringsregler"* —
and it is the second half that needs a screen. Each rule states what is culled,
what starts the clock and whether it runs automatically. Three are settable; the
fourth is the logs and it is fixed, carrying NFL-003's own sentence on the row. A
deactivated user account is **anonymised rather than erased**, because NFL-001
logged its sign-ins and those entries have to survive — what goes is the name
behind them, not the event.

Administration is **four tabs, not one page** — settings, the change log, the
event log and the watchword table. They are four different jobs that happen to
belong to one role, and stacking them made an administrator who came to do one
scroll past the other three. Every one of them still prints: a tab is a view
state and paper has none.

MI's fifth bullet invites *"annan administration som leverantören bedömer vara
central för systemets förvaltning"*, and our answer is **the logs**. The
**ändringslogg** (FH-001) shows time, user, object, field **and both the old and
the new value** — the difference between a log that records that something
changed and one that can reconstruct what it was, and what makes FAI-002's
guarantee checkable after the fact rather than merely stated at the time. The
**händelselogg** (FH-002) carries high-level events and the notifications the
system has sent. NFL-004 asks for access *"via ett administrativt gränssnitt
eller exportfunktion utan att behöva kontakta leverantören"* — the interface is
this screen, and the export that actually runs is the print, which carries MI's
mark and an *Utskriftsdatum* the way their own printouts do.

### Visualisations

| File | Shows |
|---|---|
| `anvandare-behorigheter` | The authorisation register and the read-only permission matrix — steps 1–4 |
| `administration-loggar` | System settings, change log with old and new value, event log, watchword table, retention — step 5 |
| `start-systemadministrator` | The role's start page and its full menu |

### Usability, efficiency and accessibility

**Usability.** The register answers the role's four questions in the order they
are asked, and each one is a column rather than a detail view to open. The role
change happens in the row, so nothing has to be remembered across a screen
boundary. A refused action explains itself on the control instead of failing when
pressed — the last authorisation administrator is the case an evaluator will try,
and it is the case that is handled. Nothing that should not be editable is: the
log states in its own words that it is written by the system and cannot be edited
from here.

**Efficiency.** Sorting by time, user or object turns one table into the several
questions an administrator actually asks. Filtering by role and status answers
"who can still reach Administration" in two clicks. A setting that is refused
says which way it is wrong and what the limit is, so the administrator does not
guess at an allowed value. Printing gets the answer out of the system without a
support ticket.

**Accessibility.** WCAG 2.1 AA is verified rather than claimed: axe-core runs
across every route as every role on every change, currently **0 violations**,
with no horizontal scroll between 375 px and 1920 px. Two things matter
particularly here: the tables are wide, and they scroll inside a focusable, named
region so a keyboard user can reach them at all (WCAG 2.1.1); and figures are
tabular, so a column of timestamps reads as a column. Every interactive element
has a visible focus state and a target of at least 44 × 44 px.

---

## Scenario 2 — Avtalsadministratör / Handläggare

*In the prototype: Anna Andersson, Analysenheten.*

### Task and goal

A collective agreement has to **get into the register, be kept current, and
finally be released**. It arrives two ways: as a wholly new agreement with no
previous counterpart in MIIS, or as a signed agreement protocol — normally a
scanned PDF from one of the parties — about an agreement the system already
holds.

The goal is a correct, complete and traceable record. Everything downstream reads
what the officer types: the Short-Term Wage Report, MI's annual report, the
Agreement Constructions report, and the public computer in MI's own foyer.

### Workflow

MI's four steps, in MI's order.

**1 · Registering a new collective agreement.** Two paths, because they are two
different tasks:

- **A wholly new agreement is registered manually**, and the screen says why on
  itself. §4.1's own boundary: *"Helt nya avtal – som inte tidigare tecknats –
  ska alltid registreras manuellt."* The AI support
  reads an incoming protocol *against an agreement MIIS already holds*; for a
  first-time agreement there is nothing to match against, so there is nothing to
  propose and no source passage to link a proposal to. The form is Bilaga 3's
  Basfakta reduced to what must be true before an agreement can exist at all —
  the parties, the name, the type, the sector, the period — plus the
  confidentiality marking and the report selection. It saves as **incomplete and
  unpublished**, and lists what remains before it can be published, because a new
  agreement with no wage agreement under it is not a finished record.
- **An incoming protocol** runs MI's own five steps (§4.4): upload, AI analysis,
  the matched agreement, the wage agreement and general terms, and linking the
  document. The flow **ends on the agreement it registered** rather than on the
  register: after five steps of work on one record, being handed a list of
  seventeen and told to find it again is the system losing the officer's place. OCR, watchword marking and matching run automatically. Every AI
  proposal is **source-linked** — select it and the passage it was read from is
  highlighted in the protocol beside the form (FAI-001, FAI-004) — and every one
  needs an explicit approve or reject (FAI-002). One proposal in the demo is
  deliberately wrong, so the rejected path is *shown* rather than asserted.

**2 · Adding or updating information on the agreement.** FA-001 is to register
*and edit* agreement information, and **every section that can be corrected
carries its own edit control**. The change happens on the values themselves
rather than on a second screen: the officer is looking at the record being
corrected, and moving to a form would make them remember what it said. It is
written to the change log with the time and the user (FH-001).

Two things about *what* is editable are the design rather than the scope. Two
fields are deliberately locked **and say why on their own row** — the agreement
type follows from which wage agreements exist under it, and the parties are a
relation into the party register where FA-006's name history lives, so retyping
one here would break the merger history quietly. And *Organisationsgrad* is
never an input: it recomputes while the two figures above it are typed, which is
the demonstration that it is derived rather than stored.

The agreement view is Bilaga F's **Rapport 4, Huvudrapporten** — all of it, in
**three tabs** rather than one column. *Avtalet* is what the agreement is
(identity and the four scope figures MI registers: *Anställda*, *Årsarbetare*,
*Fackmedlemmar*, *Medellön*, each dated). *Löneavtal* is what the round produced
— the row per bargaining round and the minimum wages under it. *Frågor och
grupper* is what it left open: working groups and *Särskilda frågor* in §3.11's
three numbered slots. What every one of those jobs is done *against* stays
outside the tabs, in the column beside them: FR-012's status, the publication
state, Basfakta, the Märket flags, the lifecycle. A tab that hid those would
have the officer switching back to see what they were editing. On paper it is
one document again — every panel prints, the tab strip does not.

**3 · Handling versions or changes.** An agreement in MI's model has no version
list — it has **a row per bargaining round**. FA-002 gives every renegotiation
its own wage agreement with its own construction, wage scope and cost frame, so
the comparison against the last round *is* the table, which is why it is a table
and not a stack of panels.

**The row can be corrected.** Bilaga 1 §3.1 gives the role the verb in its own
words — *"Registrerar och redigerar avtalsinformation"*, with the access
*"Läsa, skriva, redigera"* — and a wage agreement's construction and wage scope are
avtalsinformation — and the figures most likely to be wrong, because they are read
off a scanned protocol under time pressure. Construction, wage scope, cost frame
and individual guarantee are changed per bargaining round, from a form that names
the period it applies to. The validity period is changed on the agreement instead:
a round cannot run longer than the agreement it belongs to, and the field says so
rather than simply being absent. What changed *within* a period is in the event
log, with the old and the new value.

**4 · Publishing the agreement.** Publication is an **act, with a date and a
person** — not a property that follows from the record being complete. It sits
beside the status it changes rather than inside editing, because correcting a
detail and releasing an agreement are two different acts with two different
consequences, and one heading over both made the first look like it might do the
second. MI decides
when an agreement is released, and until then it exists in the register and not
in the public interface. The control is offered only on a registration marked
complete whose agreement is signed; on a half-registered one it is refused and
says why, because a half-registered agreement reaching the public computer would
be the authority publishing a draft. Once published, the officer can open the
agreement **as the public sees it** — a publication nobody can go and look at is
a claim rather than a result.

### Visualisations

| File | Shows |
|---|---|
| `avtalsregister` | The agreement register, with FR-012 status and working filters, and both ways to register |
| `registrera-uppladdning` | Step 1 — the upload and the four automatic stages |
| `registrera-protokoll` | Steps 2–5 — the protocol pinned beside the form |
| `registrera-protokoll-kallkoppling` | An AI proposal source-linked to its passage |
| `ai-assistenten` | The AI support: ask the register a question, what runs on this page, and what awaits approval |
| `avtal-huvudrapport` | One agreement — Bilaga F's Rapport 4, tabbed, with the facts it is read against beside it |
| `rapporter-urvalsbild` | The report selection screen, in MI's own shape — the criteria narrow, and every report produces a document with the criteria at its head |
| `start-avtalsadministrator` | The role's start page |

### Usability, efficiency and accessibility

**Usability.** The protocol stays beside the form while the officer scrolls, so
checking a value is a glance rather than a scroll up and back — the single
biggest time cost in the current way of working. A field's width tells the
officer what belongs in it: a date or a percentage is short, a name is wider,
free text is the row. The unit lives in the label and the box holds a bare number
(*Löneutrymme (%)* with `3,4`), so nothing has to be decided about the sign and
nothing is stored that a report cannot sum. Controls that are not available say
why on themselves rather than failing silently.

**Efficiency.** Five steps, MI's own, with no invented ones. The AI support
pre-fills what it can read and marks the watchwords MI set before the round, so
the officer's attention goes to the clauses that matter instead of to
transcription. An incomplete registration is savable and generates a reminder, so
a protocol that arrives with a gap does not block the queue. The Short-Term Wage
Report is written out from a view that already knows which agreements have been
exported before, so nothing is delivered twice.

**Accessibility.** WCAG 2.1 AA is a requirement (NFUI-003), and is verified
rather than claimed: axe-core runs across every route as every role in both
languages on every change, currently **0 violations**, with no horizontal scroll
anywhere between 375 px and 1920 px. Every interactive element has a visible
focus state and a target of at least 44 × 44 px. FR-012's colour coding always
carries a shape and a word as well as a colour, so the status of an agreement
survives greyscale, a projector and colour blindness. Every icon is decorative in
the accessible sense, with the meaning in the label beside it. The typeface is
Public Sans, drawn for government forms, self-hosted so NFA-001's ban on external
cloud dependencies holds, with tabular figures that keep columns of dates and
percentages aligned.

---

## Scenario 3 — Allmänhetens dator

*In the prototype: an unnamed visitor, no account.*

### Task and goal

A visitor comes to Medlingsinstitutet's premises — a journalist checking a claim,
a student, an employee wanting to know which agreement covers them. They want to
know **which agreement applies to a given industry or area, what period it runs
to, and whether it has been renewed**, and to take the answer away with them.

They have no account, no training and no second attempt. This is the role where
the interface has to be right the first time, and the role whose needs are least
like the case officer's.

### Workflow

MI's four steps, in MI's order.

**1 · Searching for an agreement.** The public computer opens directly on the
public view. There is no sign-in and there should not be: NFÅ-001 puts staff
authentication in Försäkringskassan's IdP with an EFOS card, and NFÅ-006
restricts public access to MI's own IP address — the machine in the room *is* the
credential. The view is visually marked as public, so nobody mistakes it for the
internal system.

The first control is a single search field. The visitor types what they came in
knowing — an industry, an agreement area, a union, an employer — and the list
narrows as they type (FR-001, FR-003). Nothing has to be chosen from a list
first, and nothing has to be pressed.

Underneath it, **bransch comes first**, because MI names it first and because a
visitor thinks in industries long before they think in employer organisations.
Then **MI's own three criteria** — employer organisation, employee organisation,
agreement — read off the selection screen for *Avtal – Allmänheten* in Bilaga F,
for the visitor who knows exactly which agreement they want. A fifth narrows to
the agreements in force at a given date (FA-020), which is the question a visitor
checking a past year asks.

**2 · Narrowing the result.** Every chosen criterion becomes a removable chip
with a count, and the table narrows for real — a filter that changes the chips
and leaves the rows in place is a control that looks live and is not. Any field
left as *Alla* means it was not narrowed, which the result states in a sentence
rather than leaving the reader to infer the population. An empty result is a
sentence, never an empty table with a header on it.

Two rules decide what is in the list at all. Only **published** agreements are
here — publication is MI's own act, and an unpublished record is in the register
and not in the foyer. And a **confidentiality-marked** agreement is still listed
and still counted (D-002): removing it would tell the visitor it does not exist,
which is a different and wrong answer. What is withheld is its detail.

**3 · Reading the agreement.** The agreement name is a link, and behind it is
Bilaga F's **Rapport 1** in full: parties, agreement area, industry, signing date,
the validity period, one row per bargaining round, termination and prolongation
(FA-015, FA-016), and the linked protocols and agreement prints.

No wage figures. The cost frame and the wage scope are MI's working material;
this is the release, and Rapport 1's own list is where it stops. A marked
agreement has **no page at all** rather than a page with the values missing:
FR-011 is about what may leave the building, and a value hidden by CSS is still
in the document.

**4 · Opening and downloading.** Two exports, and **both of them run**:

- **Print** produces a document rather than a screenshot — MI's mark and an
  *Utskriftsdatum* the way Bilaga F's printouts do, with the navigation, the
  header and every annotation dropped. Every browser can save that as PDF.
- **Download** writes a real CSV file from the record on screen, client-side, so
  it works with no server behind it (FR-013 at the scale one agreement needs).
  Semicolon-separated and BOM-prefixed, because the visitor will open it in Excel
  in a Swedish locale.

What is deliberately *not* offered is a download of the protocol PDF itself:
those files live in a document archive the prototype does not have, and a button
producing an empty or invented PDF would be worse than naming the file and saying
where it comes from. The visitor's task ends with the answer going home with
them, and a dashed button would have ended the scored scenario on a control that
does nothing.

### Visualisations

| File | Shows |
|---|---|
| `allmanheten` | The public view: free text, bransch and MI's own criteria, chips, and the result — steps 1–2 |
| `allmanheten-avtal` | One agreement as released to the public — Bilaga F's Rapport 1 — with print and download |

### Usability, efficiency and accessibility

**Usability.** One question, one field, answered while typing. The precise
criteria are underneath for the visitor who has them, and bransch is first
because that is how the question usually arrives. The view says what it is —
a public view in MI's premises — so it is never confused with the internal
system. Where something is withheld, the interface says so rather than leaving a
blank: an empty field reads as missing data and a marked one reads as withheld
data, and those are different facts about the same agreement.

**Efficiency.** No sign-in, no wizard, no page reloads: the machine is the
credential and the list narrows as the visitor types. The whole task — find,
narrow, read, take away — is four actions and never leaves two screens. The
answer leaves in one press, in whichever of the two forms the visitor needs.

**Accessibility.** This is the role with the widest range of users and the least
support, so the AA guarantees matter most here: verified by tooling on every
change, keyboard reachable throughout, visible focus, 44 × 44 px targets, and no
meaning carried by colour alone — FR-012's status is a colour, a shape *and* a
word. Dates are ISO in both languages and figures are tabular, so a column of
periods reads as a column. The page is legible at 375 px, which matters because
the machine in the foyer is not necessarily a wide screen.

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
administrator and the statistics user are worth showing as evidence that the
system is complete — but the three above are what this criterion is marked on,
and they go first. The authorisation administrator is not a fourth exhibit: §3.5
puts that work inside Scenario 1, and it is performed there, as the role §3.1
gives it to.

**The current system is not the model for the new one.** Avropsförfrågan §18.3 is
explicit: *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen
av det nya systemet."* Where this prototype follows MI's existing material it
follows the **information** — the report criteria, the five-step flow, the field
definitions — and not W3D3's interface.
