# UX brief — what actually earns the SEK 1,000,000

## The scoring

Added-value model: *comparison figure = tender sum − obtained added value*, lowest wins.

| Criterion | Max added value |
|---|---|
| Project team | 500,000 |
| Work processes and methods | 500,000 |
| **Role-based user scenarios and user interface** | **1,000,000** |
| Oral presentation | 500,000 |

Each is scored at 100 / 75 / 50 / 25 / 0 % of its maximum, judged on **relevance,
clarity, level of concreteness, feasibility, and demonstrated understanding of the
assignment's conditions and needs**.

Read that list again — only one of the five is about looks. Four are about *proving we
understand Medlingsinstitutet's work*. Design accordingly.

## Who we are designing for

MI has **15 employees** and no in-house developers. These are not casual users: a
handful of specialists who do the same tasks intensively, especially around a bargaining
round. They know the domain far better than we do. Design for the expert doing the task
for the hundredth time — density, keyboard reach, and no hand-holding — not for a
first-time visitor.

The eight roles, and what each one's day looks like:

| Role | Their reality |
|---|---|
| **Avtalsadministratör / handläggare** | The heaviest user. Protocols arrive, must be read, understood and registered correctly. Many partial registrations waiting for missing information. |
| **Medlingsadministratör** | Handles GD mediation decisions, party meetings, mediation outcomes. Time-critical and politically sensitive work. |
| **Medlaradministratör** | Maintains the mediator register; needs statistics per mediator as decision support before appointments. |
| **Statistikanvändare** | Builds composite searches, reconstructs historical states, exports for the annual report. |
| **Systemadministratör** | Logs, configuration, the watchword table. Not permissions. |
| **Behörighetsadministratör** | Users and roles only — must work without supplier involvement. |
| **Publik dator** | A walk-in visitor at MI's premises using one dedicated machine. No login, no confidential data. |
| **Medlare** (Stage 2 option) | External access via Bank-ID. |

## The three things that will decide the score

### 1. Role-adaptation must be *visible*, not asserted

The criterion has "role-based" in its name. If a demo shows one dashboard and we
*claim* it adapts, we score 50%. If the evaluator can switch role in front of us and
watch the whole start page change, we score higher. Build the switcher.

### 2. The AI story must show the human in control

FAI-001–004 are mandatory, and FAI-002 is emphatic: *AI proposals shall always require
manual review and approval by a case officer. Nothing shall be done automatically.*

MI is a Swedish public authority procuring an on-prem system with **no external cloud
dependencies** (NFA-001) — the AI runs on Försäkringskassan's Model as a Service. This
is an organisation that is interested in AI and cautious about it in equal measure.

So the mockup must show, explicitly:

- every AI-derived value labelled `AI-FÖRSLAG`
- approve / reject **per field**, not one big "accept all"
- the source: which passage of the protocol the proposal came from
- **the rejection path** — what the officer sees and does when the AI is wrong
- the confidence being a suggestion, never a fait accompli

That last one is the differentiator. Most bidders will demo AI magic. Demoing *AI under
control* is what a public authority actually wants to buy.

### 3. Domain specifics beat visual polish

The spec is full of details that only someone who read it carefully would put on screen.
Each one is cheap to add and reads as proof of understanding:

- The seven **agreement constructions** as a real, named choice — including *Local wage
  formation – figureless agreements* and *Wage pot without individual guarantee*
- **Märket** (the industry benchmark) shown as context wherever it's relevant, including
  the mediator view (FM-003)
- **Negotiation procedure agreements** — the indicator that decides whether MI appoints
  mediators at all (FF-006). Currently nine such agreements exist.
- **Separate validity periods** for wage agreements and general terms within the same
  settlement (FA-004) — the UI must not assume they coincide
- **One registration per party** (§4.2) — an agreement isn't one row
- **Party history**: name changes propagate to current agreements but never to
  historical ones (FP-004). Sveriges Lärare, Fremia — real, recent examples.
- **Registration status Incomplete/Complete** (FA-021) as a first-class state, not an
  error. Incomplete registration is normal here, not a failure.
- The **status colour coding** (FR-012): newly signed without mediation green, signed
  after mediation red, remaining blue — red when mediation-linked.
- **Snapshot / bokslut** (FH-003) — "show me the world as it was on 31 December"

Every one of these that appears on screen is a point of contact with the evaluator's
daily work.

## Constraints that shape the design

- **Swedish UI.** Not negotiable — it is the language of the system and the tender.
- **WCAG 2.1 AA** (NFUI-003). A public authority; accessibility failures are defects.
- **Responsive** (NFUI-002), but this is a desktop tool first. Design at 1440px, verify
  it survives 1280px and doesn't collapse on a tablet.
- **No cloud dependencies** (NFA-001) — nothing in the UI should imply a Microsoft 365
  or Google integration.
- **Confidentiality marking** (D-001/D-002) — confidential agreements stay in the
  statistics but their details are hidden from unauthorised users. Both facts need to be
  visible in the UI.
- **The logo is off limits.** It contains a protected Swedish state emblem. Placeholder
  until MI supplies the official asset.
- **Performance is a promise the UI makes** (NFP-003: search under 3 seconds). Don't
  design interactions that imply long waits — the current system's slowness is exactly
  what MI is escaping.

## Tone

Calm, authoritative, Swedish public sector. Generous whitespace, strong editorial
hierarchy, high legibility, restrained colour. No gradients, no glassmorphism, no
oversized rounded corners, no dashboard-for-its-own-sake data visualisation. Statistics
appear because someone needs the number, not because a chart looks impressive.

The reference point is mi.se and the MI design system in `docs/design-system/` — and,
more broadly, how Swedish authorities present themselves: serious, plain, trustworthy.
