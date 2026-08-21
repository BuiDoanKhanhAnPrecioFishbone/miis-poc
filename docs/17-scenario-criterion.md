# The scored criterion, read literally — and what it still needs

*Written 2026-08-21, after MI's Bilaga 3 arrived.*

The criterion this prototype exists to win is *Rollbaserade användarscenarier och
användargränssnitt*, **SEK 1 000 000 of 2 500 000**. The call-off (Avropsförfrågan §16)
names it and gives the scoring bands, but **not** the detailed instruction. That
instruction reached us second-hand, as an English extract, and it changes the shape of
what we deliver:

> The supplier shall present role-based user scenarios and user interfaces:
> * describe how the solution supports three user roles: **System Administrator**,
>   **Agreement Administrator/Case Officer**, **The Public Access Computer**
> * describe the user's task and goal for each scenario
> * describe the workflow for each scenario
> * attach visualisations (screenshots, wireframes or sketches) illustrating the UI
> * describe how the solution supports usability, efficiency and accessibility for each
>   user role.

## First: get Bilaga 2

That text is **not in Avropsförfrågan** — §16 there stops at the bands. Avropsförfrågan
§18.2 says Bilaga 2 *Leverantörskontroll* holds *"kompletterande krav och beskrivning av
uppdragets omfattning och innehåll"*, so this instruction is almost certainly Bilaga 2's,
and Bilaga 2 **is not in this repository**. We are currently building the most heavily
weighted deliverable in the tender against a paraphrase.

**Action: ask MI's contact — or the CEO — for Bilaga 2 and Bilaga 4 before the response
is written.** Everything below assumes the extract is accurate; if the Swedish original
names different roles or a different list of elements, that assumption is the single
thing most worth checking.

## Second: three roles, not eight

Appendix 1 §3.1 defines eight roles and the prototype implements all eight, which is
right — NFÅ-003 is a requirement about the system. But the *scored presentation* is
judged on **three**, and they are not the three the walkthrough currently leads with.

| Criterion role | Our role | Scenario | Route | State |
|---|---|---|---|---|
| System Administrator | `system-admin` | US-13 — review logs, maintain system configuration | `/administration` | **Partly** |
| Agreement Administrator / Case Officer | `agreement-admin` | US-01 … US-06, US-16 … US-20 | `/registrera`, `/avtal`, `/parter`, `/market`, `/rapporter` | **Strong** |
| The Public Access Computer | `public` | US-14 — produce a public report | `/allmanheten` | **Partly** |

The walkthrough was cut to four scenarios from chapter 9 — registration, the mediation
case, the search builder and party meetings. Two of those belong to the **mediation
administrator** and the **statistics user**, neither of whom the criterion names. So the
demo currently leads with two roles that are not scored and under-serves two that are.

That is not an argument for deleting the mediation work: the criterion says *"use the
user scenarios below as the starting point"*, and a bid that shows only the minimum is
not the bid that scores *mycket högt mervärde*. It is an argument about **order**. The
three named roles go first and get the full four-part treatment; the rest stay as
supporting evidence that the system is complete.

## Coverage, element by element

The criterion asks for four things per role. Being honest about which we have:

| | System admin | Agreement admin | Public computer |
|---|---|---|---|
| **Task and goal** | not written | not written | not written |
| **Workflow** | thin — the screen shows logs, not a task | strong — five named steps, MI's own §4.4 flow | thin — one selection, one result |
| **Visualisation** | screen exists | screens exist | screen exists |
| **Usability / efficiency / accessibility** | not written per role | not written per role | not written per role |

**The task/goal and the usability paragraph are missing for all three, and they are three
of the four things being marked.** They are writing, not building — and they are the
cheapest points on the board.

### What each role still needs built

**System Administrator.** `/administration` carries the change log (FH-001, with old and
new value), the event log (FH-002), the watchword table (FAI-004) and the retention
statement (NFL-003, NFL-004). What it does not carry is *configuration*: US-13 says
"maintain system configuration", and the only configurable thing MI names — NFÅ-002's
session timeout, *"en konfigurerbar tidsgräns (default max 30 minuter)"* — exists only as
a demo trigger. A system administrator with nothing to administer is the weakest of the
three stories.

**Public Access Computer.** `/allmanheten` matches Bilaga F's Rapport 1 exactly: the
three criteria AGO / ATO / Avtal, and confidentiality-marked information excluded in the
markup rather than in CSS. But Bilaga 3 §4 shows MI's *current* public interface has
**two** parts and we built one:

- *Gränssnitt Allmänheten* — search: via ärendekort, **Sökbyggaren**, and free-text search
- *Gränssnitt Allmänheten Avtal* — the report *Avtal – Allmänheten*

We have the second and not the first. A visitor at MI's public computer can today run a
search builder; in our prototype they can pick three dropdowns. That is a capability
regression against the system being replaced, and it is on the one role the criterion
names that has the least built.

**Agreement Administrator.** Strong, and two named scenarios are still missing a screen:
US-02 (an entirely new agreement, registered manually — which is also §4.1's own boundary,
*"Helt nya avtal … ska alltid registreras manuellt"*) and US-05's confidentiality marking,
which exists as a toggle inside registration but has no path of its own.

## What Bilaga 3 is, and what it is not

Bilaga 3 is the **user manual for MI's current system**, W3D3 Avtal, version 1.9,
2025-10-31, 95 pages (57 in the PDF we were sent). Avropsförfrågan §18.3 states its
purpose and its limit in two sentences:

> *"Bilaga 3 är användarmanualen till vårt nuvarande system. Tanken är att leverantören
> ska kunna få en fördjupad förståelse för det system varifrån informationen ska migreras
> ifrån. **Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen av det nya
> systemet.**"*

So it is **migration source material and process background — not a design template**.
Copying W3D3's screens would be the specific mistake MI wrote a sentence to prevent.
What it legitimately gives us:

**The complete field list of every registration form.** §3.3 *Basfakta* alone adds 36
custom fields, and they name things our model does not have: *Årsarbetare*,
*Fackmedlemmar*, *Anställda ackumulerat*, *Medellön*, *Timlönefaktor*, *Arbetstidskonto/-bank*,
*Rapporturval MI*, *Rapporturval lägstlöner*, *Informationsbegränsning arbetsgrupper*,
*Informationsbegränsning lägstlöner*, *Hängavtal*, *Förhandlingsordningsavtal Dnr*. The
sample data becomes markedly more credible for the cost of reading one section.

**Särskilda frågor is three numbered questions, not free text.** §3.11: *Särskild fråga
1/2/3*, each with a *jämställdhet* flag, an *avtalstext* and a comment. We folded this
into FA-014's working groups; the shape above is MI's own and is worth matching.

**A seventh report we did not know about.** §7.11 *Avtal – Utlöpningstidpunkter* — one
criterion (Årtal), *"Endast gällande avtal ingår"*, and it is grouped by month with
sections for Samtliga sektorer, Svenskt Näringsliv, and Svenskt Näringsliv per
arbetsgivargrupp. Bilaga F does not contain it, so `REPORTS` is one short.

**The mediator interface is three named reports.** §5.1: *Avtal – Medlare*, *Avtal –
Avtalsrörelse*, *Avtal – Utlöpningstidpunkter*, and nothing else, with
*"Sekretess- och GDPR-markerad information visas ej"* at the head. FR-011's mediator half
now has an exact specification and we have no mediator entrance at all.

## The plan, in the order it should be done

**1 — Ask for Bilaga 2.** One message. Everything else is built against a paraphrase
until it arrives.

**2 — Write the three scenario narratives.** Task and goal, workflow, and a
usability/efficiency/accessibility paragraph per role. Three of the four scored elements
are prose we have not written, and the material for all of it already exists in the
repository. This is the highest score per hour available.

**3 — Give the public computer its search.** Bilaga 3 §4.1 says MI's visitors have a
search builder today. Reusing `/sok` in a reduced, read-only, confidentiality-filtered
form closes a capability regression on a role the criterion names.

**4 — Give the system administrator something to administer.** NFÅ-002's configurable
timeout, the watchword table it already owns, and the retention settings, on one
configuration panel — so US-13's "maintain system configuration" has a screen and the
role has a workflow rather than two logs.

**5 — Add *Avtal – Utlöpningstidpunkter* to the report catalogue**, and the mediator
entrance that Bilaga 3 §5 specifies as exactly three reports.

**6 — Enrich the agreement model from Bilaga 3 §3.** Not all 36 fields; the ones the
reports and the scenarios actually read — *Årsarbetare*, *Fackmedlemmar*, *Medellön*,
*Hängavtal*, *Rapporturval*, *Informationsbegränsning* — plus Särskilda frågor in MI's own
three-question shape.

**7 — Re-cut the walkthrough** so the three scored roles lead it, with the mediation and
statistics scenarios kept as evidence of completeness rather than as the opening.

## What this does not change

The four screens from chapter 9's sketches stay built and stay good; the mediation
administrator remains the most distinctive thing in the prototype and nobody else will
have the party-meeting view. The change is which story the response tells first.
