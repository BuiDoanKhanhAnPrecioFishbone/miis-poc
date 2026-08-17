# Project brief — everything you need to hold a conversation about MIIS

Written for anyone joining the project who needs to support the design work: what we're
bidding on, who the customer is, what the words mean, and what wins.

---

## 1. The customer

**Medlingsinstitutet (MI)** — the Swedish National Mediation Office. A government
agency, org. no. 202100-5174, at Drottninggatan 89 in Stockholm. **Fifteen employees**
and no in-house developers.

Three jobs, all of which the system touches:

1. **Mediate** in labour disputes — appoint mediators when negotiations break down
2. **Promote an efficient wage formation process** — which in practice means watching
   that the labour market stays within the industry cost norm
3. **Produce official statistics** on wages and collective agreements

They monitor **central industry-level collective agreements** where an employer
organisation is a party. Explicitly out of scope: local agreements, company agreements
without an employer organisation, and *hängavtal* (application agreements).

## 2. What they are buying, and why now

**MIIS** — a purpose-built web system for registering, searching, analysing and
reporting collective agreement data.

Today it runs as a customisation inside **W3D3**, Formpipe's case management system, and
it has hit four walls the tender names explicitly:

| Problem today | Why it matters |
|---|---|
| Capacity ceiling around **3,500 agreements** | They are near it |
| Reports take unreasonable time, or cannot run at all | Blocks statutory reporting |
| Query builder limited to **two document types at once** | Forces technical workaround variables |
| Cannot export structured data | Manual re-keying for statistics |

Data migrates from W3D3 (Formpipe will assist with the extract) and from an older
**Access database**.

**Why the urgency:** Stage 1 must be live before **1 April 2027**, in time for the major
bargaining round. Missing that means MI runs the biggest year on the system they are
trying to escape.

## 3. The procurement — how we win or lose

- **Framework:** Kammarkollegiet, *Systems Development*, no. 23.3-2651-2022
- **Method:** *Renewed competition* (förnyad konkurrensutsättning) — the request goes to
  **all suppliers on that framework**, six in total
- **Call-off reference:** 2026/0059
- **Model:** added value. `Comparison figure = tender sum − added value obtained`.
  **Lowest comparison figure wins.**

| Award criterion | Max added value |
|---|---|
| Project team | SEK 500,000 |
| Work processes and methods | SEK 500,000 |
| **Role-based user scenarios and user interface** | **SEK 1,000,000** |
| Oral presentation | SEK 500,000 |

Each is scored **100 / 75 / 50 / 25 / 0 %** on *relevance, clarity, level of
concreteness, feasibility, and demonstrated understanding of the assignment*.

**What this means concretely:** the UI criterion is 40% of all obtainable added value.
Scoring 100% instead of 50% on it is worth SEK 500,000 off our comparison figure — we
can be half a million more expensive than a rival and still win on it. That is why the
prototype exists.

### Dates

| Date | What |
|---|---|
| 2026-07-28 | Call-off sent out |
| 2026-08-18 | Deadline for questions (Peter Lundström, peter.lundstrom@mi.se) |
| **2026-08-25** | **Tender response deadline** (valid 90 days) |
| Week 35 | 15-minute oral presentation at MI |
| 2026-09-08 | Award decision, then LOU standstill |
| 2026-09-22 | Appeals deadline |

Commercial: e-invoicing via Peppol, address `0007:2021005174`, 30-day payment terms.

### Delivery stages

- **Stage 1** — before 2027-04-01. Registration, search and reporting of wage agreements
  and general terms, plus mediation.
- **Stage 2** — autumn 2027 at the earliest. Pension agreements, insurance, other
  agreement types. Requirements marked "Stage 2".
- **Stage 3 (option)** — support and maintenance, 2 years extendable 2 + 2 (max 6).
  Fixed annual fee; development at tender hourly rates, indexed to Statistics Sweden's
  AKI (SNI J), max 4% per year, earliest after 12 months. No guaranteed volume.

## 4. The competition

Six suppliers hold the framework agreement and all are invited to bid. Publicly,
**C.A.G** is one of them. The others are on Kammarkollegiet's own supplier list at
avropa.se if you want the full picture.

**Formpipe** is the incumbent — their W3D3 product is what MIIS replaces. They are not
necessarily bidding, and the tender states they will assist with the database extract.

The competitive logic worth holding in your head: everyone bidding is a competent Swedish
systems house on the same framework, quoting broadly comparable rates. **The differentiator
is the added value, and the biggest single slice of it is the interface.** A rival who
submits a well-written text response with no working prototype is scoreable at 50–75% on
that criterion. A clickable, requirement-annotated prototype in the customer's own
language is how you take 100%.

## 5. Constraints that shape every design decision

| Constraint | Requirement | Consequence |
|---|---|---|
| **On-prem only** | NFA-001 | No Azure/Entra ID, AWS or Google. Nothing in the UI may imply a Microsoft 365 or cloud integration. |
| Operations | — | Försäkringskassan runs it, in MI's server environment |
| **AI** | §4.1 | Via Försäkringskassan's *Model as a Service*, inside the same environment |
| Authentication | NFÅ-001 | EFOS cards, SAML 2.0, through Försäkringskassan's IdP. Permissions from Enterprise IAM/SSID. |
| External mediators | NFÅ-007 | Bank-ID — **Stage 2 option**, not now |
| Public access | NFÅ-006 | One dedicated computer at MI's premises, IP allow-listed, no login |
| Accessibility | NFUI-003 | WCAG 2.1 AA |
| Responsive | NFUI-002 | But it is a desktop tool first |
| Performance | NFP-003 | Search under 3 seconds. Never design an interaction implying a long wait — slowness is what they are escaping. |
| Database | §4.6 | Relational, Microsoft SQL Server suggested |
| Meetings | §2.1 | All project meetings physical, at MI |

Our proposed architecture in the tender: React/TypeScript SPA, ASP.NET Core (.NET 8) on
Windows Server/IIS, a .NET Worker Service for scheduled jobs, SQL Server with temporal
tables for history, and adapters to the IdP, IAM, Model as a Service and SMTP.

> Note: this prototype is Next.js on Vercel. That is fine for a **UX demo** and nothing
> more. Never present it to MI as the delivery architecture.

## 6. The eight user roles

| Role (Swedish) | English | What their day looks like |
|---|---|---|
| **Avtalsadministratör / handläggare** | Agreement administrator | The heaviest user. Protocols arrive, must be read, understood and registered. Many partial registrations awaiting missing information. |
| **Medlingsadministratör** | Mediation administrator | Handles Director-General mediation decisions, party meetings, mediation outcomes. Time-critical, politically sensitive. |
| **Medlaradministratör** | Mediator administrator | Maintains the mediator register; needs statistics per mediator before appointments. |
| **Statistikanvändare** | Statistics user | Composite searches, historical reconstruction, exports for the annual report. |
| **Systemadministratör** | System administrator | Logs, configuration, the watchword table. Not permissions. |
| **Behörighetsadministratör** | Permission administrator | Users and roles only — must work without supplier involvement. |
| **Publik dator** | Public computer | A walk-in visitor at MI's premises. No login, no confidential data. |
| **Medlare** | Mediator | External access via Bank-ID. Stage 2 option. |

## 7. The vocabulary — the part that actually takes time to learn

This is the domain language. If you can use these correctly you can hold any conversation
about the project.

### Agreements

| Term | What it means |
|---|---|
| **Avtal** | Agreement. The overarching entity: name, parties, type. **One registration per party** — an agreement is not one row. |
| **Avtalsområde** | Agreement area. Groups several agreements that have different parties. |
| **Avtalskonstruktion** | Agreement construction. **Seven** MI-defined ways the wage scope is determined and distributed. |
| **Löneavtal** | Wage agreement. A new row per bargaining round. Has two subgroups: *Lönerevision* (wage revision) and *Lägstalön* (minimum wage). |
| **Allmänna villkor** | General terms and conditions. **Has its own validity period** — it need not match the wage agreement's. This trips people up. |
| **Sifferlösa avtal** | "Figureless" agreements — local wage formation with no central percentage |
| **Stupstock** | The fallback figure that applies if local parties fail to agree |
| **Individgaranti** | Individual guarantee — a floor each employee is guaranteed |
| **Löneutrymme / kostnadsram** | Wage scope / cost frame — the money available, and its total cost |
| **Prolongering** | Extension of an existing agreement |
| **Registreringsstatus** | Incomplete or Complete. **Incomplete is normal here, not an error.** |

### The norm

| Term | What it means |
|---|---|
| **Märket** | "The mark". The industry cost norm. Industry signs first and sets the number the rest of the labour market is expected to stay within. **This is the centre of gravity of the entire Swedish model.** |
| **Industrimärke** | Flag on the agreements that are norm-setting |

### Negotiation and mediation

| Term | What it means |
|---|---|
| **Förhandling** | Negotiation. Two types: *Avtalsrörelse* (bargaining round) and *Övrig förhandling*. |
| **Avtalsrörelse** | The bargaining round — the periodic renegotiation of agreements across the labour market |
| **Förhandlingsordningsavtal** | Negotiation procedure agreement. Where parties have one (**currently nine exist**), they mediate under their own procedure and **MI appoints no mediators**. Decisive. |
| **Medling** | Mediation. *Särskild medling* = union-level, requires a Director-General decision. *Fast medling* = local disputes, simplified form. |
| **GD-beslut** | Director-General decision appointing mediators |
| **Varsel** | Notice of industrial action — GD decision templates come with and without one |
| **Stridsåtgärd** | Industrial action — strike, lockout, blockade |
| **Partsträff** | Party meeting. MI meets **one** party ahead of a bargaining round. The parties do not meet each other, and **a party meeting is not a negotiation.** |

### Parties

| Term | What it means |
|---|---|
| **Part** | Party. Two types: **AGO** (arbetsgivarorganisation, employer) and **ATO** (arbetstagarorganisation, union). |
| **Samverkansorgan** | Cooperation body between unions. Types *Huvudorganisation* (umbrella) or *Samverkan*, with a "negotiating body yes/no" attribute. |
| **Namnhistorik** | Name history. A name change propagates to **current** agreements but **never to historical ones**. Real examples: Lärarförbundet + Lärarnas Riksförbund → **Sveriges Lärare**; KFO + Idea → **Fremia**. |

### System concepts

| Term | What it means |
|---|---|
| **Bokslut** | Snapshot. Reconstruct how the data looked on a given date, e.g. 31 December. The old system cannot do this. |
| **Bevakningsord** | Watchword. A customisable table of terms highlighted in incoming protocols. |
| **Rapporturval** | Report selection. Properties on an agreement governing which reports include it. |
| **Diarienummer** | Registry number, linking to MI's separate case registry |
| **Gallring** | Retention deletion of personal data |
| **Sekretessmarkering** | Confidentiality marking. Details hidden from unauthorised users, **but still counted in statistics.** |

### The reports they need

- **Avtalsrörelserapporten** — the bargaining round report
- **Avtalskonstruktioner** — distribution of agreements and employees per sector and construction
- **Konjunkturlönerapporten** — the short-term wage report. The spec describes its view in
  unusual detail, which makes it easy points if built exactly.

## 8. Requirements at a glance

- **25 epics**: 11 functional (F1–F11), 14 non-functional (NF1–NF14)
- **72 functional features** — 70 mandatory, 2 desirable
- **59 non-functional features** — 58 mandatory, 1 option
- Three classes: **Ska-krav** (mandatory, must be met), **Bör-krav** (desirable),
  **Option** (future, but the design must allow it)
- **20 role-based user scenarios**, US-01 to US-20, covering all eight roles
- Chapter 9 has requirement-annotated UI sketches for the start page and US-01, US-07,
  US-11 — the four screens already built

Full text: `docs/requirements/requirements-v2.5-EN.txt` (searchable). Ask Claude Code
`/spec US-08` rather than reading it.

## 9. The AI angle — and why it is delicate

Four mandatory requirements (FAI-001 to 004): propose field values from an uploaded
protocol, OCR scanned documents, highlight watchwords, and — **FAI-002** — *"AI proposals
shall always require manual review and approval by a case officer. Nothing shall be done
automatically."*

MI is a public authority procuring an on-prem system with no cloud dependencies. They are
interested in AI and cautious about it in equal measure. **Demonstrating AI under human
control scores better than demonstrating AI cleverness.** Most bidders will do the
opposite.

## 10. Where the prototype stands

12 screens: **4 designed** (start page, US-01 registration, US-07 mediation case, US-11
query builder), **8 stubs** showing their requirement content.

Built in: a role switcher across all eight roles, and three demo datasets (empty /
normal / peak load).

Two-week plan: **week 1** the designer works on UX and flows, CEO decides go/no-go;
**week 2** the POC — which lands on week 35, the oral presentation.

## 11. How to help her

The four commands in Claude Code do most of the work: `/spec`, `/screen`, `/flow-test`,
`/audit`. See [`00-START-HERE.md`](00-START-HERE.md) and
[`01-workflow.md`](01-workflow.md).

Useful things you can do without touching the design:

- Get an answer from **Peter Lundström** before 08-18 if anything in the requirements is
  genuinely ambiguous — that deadline passes and the question is closed
- Chase MI's **official logo asset**; the header is a placeholder and we must not draw one
- Confirm the **licensed MI brand font**; the design system deliberately falls back to
  Arial because it could not be verified
- Validate the **colour palette** against MI's real brand files — ours is derived from
  their public identity, not supplied
- Prepare the **oral presentation script** for week 35 — 15 minutes, and the role switcher
  is the strongest opening move available

## 12. The three things most likely to lose points

1. **Generic dashboard UI.** The criterion rewards demonstrated understanding of *their*
   work, not visual polish. Domain specifics on screen beat gradients.
2. **AI shown as magic.** FAI-002 is emphatic. Show the rejection path.
3. **Only happy paths.** Empty states, incomplete registrations and errors are where
   this domain actually lives — incomplete registration is a normal state here, not a
   failure.
