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
custom fields, and they named things our model did not have (**taken up — see item 6**): *Årsarbetare*,
*Fackmedlemmar*, *Anställda ackumulerat*, *Medellön*, *Timlönefaktor*, *Arbetstidskonto/-bank*,
*Rapporturval MI*, *Rapporturval lägstlöner*, *Informationsbegränsning arbetsgrupper*,
*Informationsbegränsning lägstlöner*, *Hängavtal*, *Förhandlingsordningsavtal Dnr*. The
sample data becomes markedly more credible for the cost of reading one section.

**Särskilda frågor is three numbered questions, not free text.** §3.11: *Särskild fråga
1/2/3*, each with a *jämställdhet* flag, an *avtalstext* and a comment. We folded this
into FA-014's working groups; the shape above is MI's own. **Built — see item 6.**

**A seventh report we did not know about.** §7.11 *Avtal – Utlöpningstidpunkter* — one
criterion (Årtal), *"Endast gällande avtal ingår"*, and it is grouped by month with
sections for Samtliga sektorer, Svenskt Näringsliv, and Svenskt Näringsliv per
arbetsgivargrupp. Bilaga F does not contain it, so `REPORTS` was one short. **Built —
see item 5.**

**The mediator interface is three named reports.** §5.1: *Avtal – Medlare*, *Avtal –
Avtalsrörelse*, *Avtal – Utlöpningstidpunkter*, and nothing else, with
*"Sekretess- och GDPR-markerad information visas ej"* at the head. FR-011's mediator half
now has an exact specification. **Built — see item 5.**

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

**5 — Add *Avtal – Utlöpningstidpunkter* to the report catalogue** ~~and the mediator
entrance that Bilaga 3 §5 specifies as exactly three reports.~~ **Done.**

- **The seventh report is built.** `utlopningstidpunkter` in `REPORTS`, one criterion
  (*Årtal*), and a result in Bilaga 3 §7.11's own three sections — *Samtliga sektorer*,
  *Svenskt Näringsliv*, *Svenskt Näringsliv per arbetsgivargrupp* — each a bar chart and a
  table. It is **not Avtalsrörelserapporten with different words**: Rapport 3 splits the
  year by FR-012 status, this one splits it by who signs. The three charts share one
  scale, so a small section cannot look like a large one.
- **Only agreements in force.** `isCurrent` is `Boolean(signedDate)` — an unsigned
  agreement is *kvarstående*, so its expiry is nobody's date. It is deliberately **not**
  "has not run out yet": a report taken in June for 2027 has to show April, and an earlier
  draft that compared against the extraction date dropped two thirds of the year.
- **The mediator's entrance matches §3.1.** The role's own words are *"Specifika
  rapporter"*, so the menu is Start and Rapporter, `write` is empty, and the picker is
  narrowed by `reportsForRole` rather than by hiding options — a URL cannot reach a report
  the role was not given. Konjunkturlönerapporten and the scheduled extracts are off the
  screen for both external roles, because neither is one of the three Bilaga 3 §5.1 names.
- **Two defects the generated report then exposed, both now fixed.** Employee figures
  printed as `52510` — `decimal()` does no thousands grouping and `amount()` does; the
  Avtalsrörelse report had the same bug. And *Svenskt Näringsliv per arbetsgivargrupp*
  showed a group called *Svenskt Näringsliv*, because the party register was carrying the
  confederation in `employerGroup`. The real groups are Bilaga F Rapport 2's own —
  **Almega, Industriarbetsgivarna, Transportföretagen, Övriga Svenskt Näringsliv** — and
  the registration form now derives its list from the register instead of holding a second
  hand-written one.
- **Centralorganisation is two criteria, not one.** MI's selection screen shows it twice,
  once per side, and the lists have nothing in common. A single shared list offered
  Svenskt Näringsliv under *Centralorganisation (ATO)* — a selection that could only
  return nothing, for a reason the user could not see.

**6 — Enrich the agreement model from Bilaga 3 §3.** ~~Not all 36 fields; the ones the
reports and the scenarios actually read — *Årsarbetare*, *Fackmedlemmar*, *Medellön*,
*Hängavtal*, *Rapporturval*, *Informationsbegränsning* — plus Särskilda frågor in MI's own
three-question shape.~~ **Done.**

What was taken is the **shape of the information MI keeps**, never the shape of a W3D3
screen — §18.3 is explicit that the old system is not a starting point, and the manual is
migration source material, which is exactly what this used it for.

- **Four scope figures, not one.** We held *Anställda*; MI holds *Anställda*,
  *Årsarbetare*, *Fackmedlemmar* and *Medellön*, each dated. They answer different
  questions and a cost frame applies to the second — 9 400 employees in home services is
  6 100 årsarbetare. *Organisationsgrad* is **derived** from two of them rather than
  stored: a third saved number is a third number that can go stale, and it has to be able
  to say "not known" where MI's own printouts show `¤`.
- **A flag is always paired with a comment.** *Hängavtal*, *Organisatorisk
  avtalsförändring*, *Avtalet upphört*, plus *Förhandlingsordningsavtal Dnr*. The flag is
  what a report can count; the comment is why an officer set it. `Nej` **with** a comment
  is a real state — "checked 2027-05-06, and it is not one" is different from nobody
  having looked, and one agreement in the sample carries exactly that.
- **Avtalet upphört now reaches the report.** `isCurrent` closes the note it was carrying:
  ceased is not expired. An expired agreement applies until it is replaced, which is what
  makes it *kvarstående*; a ceased one does not apply at all, so its expiry date is a date
  nothing hangs on.
- **Informationsbegränsning is per section, and it is not sekretess.** MI's form carries
  two — *arbetsgrupper* and *lägstlöner* — and an agreement can have one, both or neither
  and still not be sekretessmarkerat. It takes both halves: the record says *what* is
  restricted (`isSectionLimited`), the role says *who* may read it (`maySeeConfidential`).
  The withheld section is **never rendered**, per FR-011 and D-002 — and the officer who
  set the restriction sees it named on Basfakta, because a restriction nobody can see back
  is one nobody can lift.
- **Rapporturval was registered on every agreement and shown nowhere**, so an officer
  could not see why one agreement reaches Konjunkturlönerapporten and the next does not.
- **Särskilda frågor in §3.11's own shape** — three numbered slots, each with a
  *jämställdhet* flag, an *avtalstext* and a comment. We had folded this into
  `WorkingGroup.subjectAreas`, which read FA-014 rather than MI's form. They are different
  things and both are real: a working group is a **body** with a reporting date, a
  särskild fråga is a **question the agreement text answers**. The slot numbering is kept
  even with a gap — MI's reports refer to *Särskild fråga 3*, so renumbering it because
  slot 2 is empty would rename the thing being pointed at.

**Deliberately not done: the registration form is unchanged.** These are properties of the
agreement record, not of the protocol being read, and five more boxes in US-01's five-step
flow would work against the scenario the criterion is actually marked on. The remaining
§3.3 fields — *Timlönefaktor*, *Arbetstidskonto/-bank*, *Semester*,
*Föräldraledighetstillägg*, *Pensionsavtal deltid* — belong to Allmänna villkor and
Pensionsavtal, which are sections of their own rather than basfakta.

**7 — Re-cut the walkthrough** ~~so the three scored roles lead it.~~ **Done, and built
into the prototype: `/genomgang`.**

An evaluator opening the deployed URL cold landed on a start page with no orientation, as
the agreement administrator, with nothing saying which of the eight roles the criterion is
marked on. The guide is now the address to send them to —
**miis-poc.vercel.app/genomgang** — and it is what the fifteen-minute presentation runs
from.

The three scored roles first, each with the four elements the criterion asks for, and
**every step is a control that switches to the role and opens the screen**. Switching is
the point rather than a convenience: "the role decides what you see" is the claim, and a
link that left the reviewer as the wrong persona would show them the authorisation notice
instead of the screen. A test asserts that for all sixteen steps, from the same
`accessLevel` the screen guard asks.

It is **outside the `(miis)` route group** — no shell, no navigation, no menu entry — and
it says what it is in its first sentence, in the demo strip's own colour. Same rule as the
demo bar: inventing a "walkthrough module" would work against the criterion it is meant to
serve. The other five roles stay, below, as evidence that the system is complete.

**Then it turned out to be hard to *use*, which is a different failure.** Everything was
expanded — seven scenarios, 10 236 characters, 5 267 pixels, no contents — so a reviewer
landed in the middle of scenario one with no way to see the shape of what they had opened.
Sixteen buttons all read *"Öppna som Avtalsadministratör"*. And it was a page you **left**:
opening step 2 took you to a screen, and the only route to step 3 was back here to find
your place in the document.

- **A contents list of all seven**, with role, step count and which three are scored, and
  **one scenario shown at a time**. 5 267px → 2 300px.
- **A step names the step**, and names the role only when the persona is about to change —
  the one case it is a warning rather than noise.
- **The position travels.** Opening a step writes it to a cookie, and the demo strip then
  carries *Nästa: Avtalsregistret* on every screen, switching the role exactly as the
  guide's own buttons do. A whole scenario now walks end to end without returning here,
  and returning lands on the scenario you were in. The control lives in the demo strip
  rather than the product chrome, for the same reason the guide has no menu entry.

If there is an existing walkthrough document held outside this repository, send it and the
two can be reconciled; `lib/domain/walkthrough.ts` is the content, so aligning wording is
an edit to one file.

## What this does not change

The four screens from chapter 9's sketches stay built and stay good; the mediation
administrator remains the most distinctive thing in the prototype and nobody else will
have the party-meeting view. The change is which story the response tells first.
