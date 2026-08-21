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
| System Administrator | `system-admin` | US-13 — review logs, maintain system configuration | `/administration` | **Strong** (after item 4) |
| Agreement Administrator / Case Officer | `agreement-admin` | US-01 … US-06, US-16 … US-20 | `/registrera`, `/avtal`, `/parter`, `/market`, `/rapporter` | **Strong** |
| The Public Access Computer | `public` | US-14 — produce a public report | `/allmanheten` | **Strong** (after item 3) |

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

*Updated after item 2 — the narratives are now in `docs/18-role-scenarios.md`.*

| | System admin | Agreement admin | Public computer |
|---|---|---|---|
| **Task and goal** | written | written | written |
| **Workflow** | **strong** — two logs, the watchword table, four settings and a working export (item 4 done) | strong — five named steps, MI's own §4.4 flow | **strong** — free text, MI's three criteria, valid-at-date, print (item 3 done) |
| **Visualisation** | `administration-loggar`, `start-systemadministrator`, `anvandare-behorigheter` | eight shots incl. `ai-assistenten` | `allmanheten` |
| **Usability / efficiency / accessibility** | written | written | written |

Three of the four elements were prose nobody had written, and that was the cheapest score
on the board. All four are now written for all three roles, and after items 3 and 4 none
of the three narratives carries a *to be strengthened* caveat. What is left in the plan is
material that makes the offer richer rather than the criterion answerable.

### What each role still needs built

**System Administrator — resolved, see item 4.** `/administration` carried the change log
(FH-001), the event log (FH-002), the watchword table (FAI-004) and the retention statement
and nothing that was a *setting*, so US-13's "maintain system configuration" had no screen.
It now has one, with the two settings MI calls configurable editable and the two the
requirements keep out of this role's hands shown with their reason.

**Public Access Computer — resolved, see item 3.** Bilaga 3 §4 shows MI's *current*
public interface has two parts: *Gränssnitt Allmänheten* (search via ärendekort, the
search builder, and free text) and *Gränssnitt Allmänheten Avtal* (the report). We had the
report and a selection that turned out not to select at all. It now has free-text search,
MI's three criteria, a valid-at date and a real empty state; the query builder stays out
on stated grounds.

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

**1 — Ask for Bilaga 2.** ~~One message.~~ **Sent 2026-08-21.** Everything below stays
built against a paraphrase until it comes back; if the Swedish original names different
roles or different elements, `docs/18-role-scenarios.md` is the file to re-check first.

**2 — Write the three scenario narratives.** ~~Task and goal, workflow, and a
usability/efficiency/accessibility paragraph per role.~~ **Done — `docs/18-role-scenarios.md`.**
All four elements for all three roles, with the screenshot for each named. Two places are
marked *to be strengthened before submission* rather than papered over: the system
administrator has no configuration screen (item 4) and the public computer has no search
(item 3). The draft is English; the response is Swedish, and the note at the top says so.

**3 — Give the public computer its search.** ~~Bilaga 3 §4.1 says MI's visitors have a
search builder today.~~ **Done.** And it turned out to be worse than a missing feature:
the selection on `/allmanheten` **did not select** — three dropdowns with no state, two
buttons disabled with "Ej aktiv i demon", and a table that showed every agreement whatever
was chosen. On the one role the criterion names, the primary control was a picture of one.

It now has a free-text field that narrows as the visitor types (FR-001, FR-003), MI's own
three criteria from Bilaga F's Rapport 1, a valid-at date (FA-020), removable chips with a
count, and a real empty state. `publicSearch` is a tested domain rule.

The **query builder is deliberately still not** in the public view, and the reasoning is
on the screen rather than left to be noticed: W3D3 offers it to the public because W3D3 is
a generic diary product whose public interface was configured rather than designed, and
§18.3 says the old system is not the starting point. It is reversible — the same component,
with `maySeeConfidential` already deciding what it may return.

**4 — Give the system administrator something to administer.** ~~NFÅ-002's configurable
timeout, the watchword table it already owns, and the retention settings, on one
configuration panel.~~ **Done**, and with a better answer than "four editable boxes":

- **NFÅ-002's session limit is configurable end to end** — set on Administration, written
  as a cookie, read by `getSession`, applied by the inactivity warning and stated on the
  start page. Set it to ten minutes and the warning arrives at eight. The ceiling is
  thirty, because MI's sentence gives a maximum and a longer limit would weaken the
  requirement rather than configure it; the field says so when it refuses.
- **Two settings are deliberately fixed, with the requirement on the row.** NFL-003 names
  *systemadministratörer* in its prohibition, so log retention is a padlock and a reason
  rather than a field; NFÅ-006's IP restriction lives in Försäkringskassan's operation of
  the environment. Showing the two that are fixed beside the two that are not is what says
  the sentences were read.
- **NFL-004's export runs.** The requirement asks for the logs *"via ett administrativt
  gränssnitt eller exportfunktion"*; the interface is the screen and the export that needs
  no server is the print, which now carries MI's letterhead here too.

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
