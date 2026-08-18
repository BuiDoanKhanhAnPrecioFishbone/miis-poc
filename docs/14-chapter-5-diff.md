# Chapter 5 diff — our requirement IDs against MI's own

Run 2026-08-18 against `docs/requirements/tender/Bilaga_1_Kravspecifikation.pdf`
chapter 5 (*Funktionella krav*, §5.1–§5.11, pages 18–23).

This was the open item from `docs/13`. Every requirement tag on every screen traced to
**our English rendering** of MI's document, never to MI's document itself. If that
rendering had dropped, renamed or invented an ID, the traceability layer — which is a
large part of what the award criterion pays for — would have been pointing at nothing.

**It had not.** MI uses the same `FA-*/FR-*/FAI-*` scheme we do, and the IDs line up.

## Integrity: three checks, all clean

| Check | Result |
|---|---|
| Rendered on a screen but no sentence in `requirements.ts` — a tag whose tooltip would be blank | **none** |
| In `requirements.ts` but nowhere in MI's document — an invented or renamed ID | **none** |
| Rendered on a screen but not in MI's document at all | **none** |

Seventeen design-critical requirements were also compared sentence by sentence against
MI's Swedish — FS-001, FA-001, FA-007, FA-011, FA-012, FA-018, FA-021, FA-022, FR-012,
FAI-001–004, FD-001, FF-004, FF-006, FM-003. All faithful, with one exception, below.

## What the diff found, and what was done

### 1. FAI-004's tooltip said more than MI's requirement does

MI's row is exactly:

> Systemet ska ha funktionalitet för att markera och plocka ut bevakningsord ur dokument

Our sentence added *"utifrån en fördefinierad och anpassningsbar bevakningsordstabell"*.
That detail is real, but it is in **§4.1's prose**, not in FAI-004's row:

> Bevakningsordsmärkning. Systemet ska kunna markera och lyfta fram text i olika dokument
> utifrån **en fördefinierad och anpassningsbar tabell med bevakningsord**.

A traceability layer that overstates the requirement it cites is the one failure mode
that matters here, even at this scale. The sentence now carries MI's row and attributes
the rest: *"Tabellen är fördefinierad och anpassningsbar enligt Bilaga 1 §4.1."*

### 2. Five chapter 5 requirements had no sentence at all

`FA-014`, `FA-023`, `FA-024`, `FR-009`, `FR-010`. Four are the Steg 2 requirements MI
defers itself; **`FA-014` is a Stage 1 Ska-krav** — *registrering av arbetsgrupper med
frågeområden* — and our English rendering had simply lost it. All five now have
sentences, so any future tag resolves.

### 3. Nine Stage 1 requirements were nowhere on any screen

Not because they were unknown, but because no screen claimed them. Several are things
the prototype already does.

| | MI's requirement | Where it now sits |
|---|---|---|
| FA-005 | Registrering av försäkringsinformation | `/avtal` |
| FA-006 | Övriga avtal, exempelvis förhandlingsordningsavtal | `/avtal` |
| FA-013 | Lägstalöner grupperade per yrkesgrupp med revisionsdatum | `/avtal` |
| FA-014 | Arbetsgrupper med frågeområden | `/avtal` |
| FA-015 | Avtal som löper ut och inte förnyas | `/avtal` |
| FA-016 | Förtida uppsägning | `/avtal` |
| **FA-019** | **Söka fram avtal med vissa egenskaper** | **`/sok` — already built** |
| FP-005 | Söka fram parter med vissa egenskaper | `/parter` |
| FP-006 | Kontaktpersoner (namn, titel, telefon, e-post) för AGO och ATO | `/parter` |

`FA-019` is the notable one: `/sok` *is* that requirement, and it sat untagged only
because our rendering filed the same capability under FR-001/FR-002. It is now on the
page heading beside them.

The rest go on the `/avtal` and `/parter` placeholders, which declare what a module will
cover rather than claiming it is built — the honest home for a requirement with no screen
yet. Each needed a paired Swedish and English sentence, since `Placeholder` matches
`featureIds` to `features` positionally.

### 4. A sentence that contradicted MI

`/avtal` described FA-011 as *"Jämställdhetsflagga **på löneavtal**"*. MI's requirement is
*"Systemet ska ha en jämställdhetsflagga **per avtal**"*. Corrected in both languages.

This is the copy half of the divergence `docs/12` already logged as a type problem: our
`WageAgreement` carries the flag and the model puts it on `Agreement`. **The control stays
where it is on `/registrera`** — the CEO's sketch and US-01's flow both set it during the
wage-agreement step, and a panel is a step in a flow, not a table. Only the type and the
sentence were wrong.

## Coverage after

| | Before | After |
|---|---|---|
| Chapter 5 requirements shown somewhere | 59 of 72 | **68 of 72** |
| Stage 1 requirements not shown anywhere | 9 | **0** |
| Remaining gaps | — | FA-023, FA-024, FR-009, FR-010 — all **Steg 2**, deferred by MI |

## Findings not acted on

**MI describes three AI functions in §4.1; the prototype shows two.**

> **AI-stöd vid huvud- och avtalsinformationsregistrering.** Via fritextsökning i protokoll
> och avtal ska systemet kunna identifiera och föreslå registrering av specifika
> skrivningar, exempelvis om jämställdhet, arbetstidsförkortning eller andra utpekade
> bestämmelser.

We show quick registration (FAI-001) and watchword marking (FAI-004). The third — AI
proposing a *specific wording* found by free-text search — is what US-01's main flow means
by *"the officer approves and sets the gender equality flag where applicable"*. On
`/registrera` the equality flag is a plain toggle, defaulted on, with no AI labelling and
no source link, so a requirement MI describes as AI-assisted currently reads as manual
data entry.

The fix is small and uses machinery that already exists — the violet `AI-FÖRSLAG` pill and
the source link, applied to the two flag toggles, pointing at the protocol lines about
*arbetstidsförkortning* and jämställdhet. It is a design change rather than a diff
correction, so it is logged here rather than done.

**§4.1 also confirms two things we had reasoned to.** *"Handläggaren godkänner **varje
steg** manuellt"* — approval is per step, matching the two *Manuell justering/godkännande*
boxes in §4.4 and the two approvals on `/registrera`. And *"Helt nya avtal – som inte
tidigare tecknats – ska **alltid registreras manuellt**"*, which is US-02 and why
`/registrera` says *Avtal (matchat)*.

## Not covered by this diff

- **Chapter 6** (*Icke-funktionella krav*, §6.1–§6.11, 38 IDs) was not diffed. §6.10
  *Användargränssnitt* and §6.2 *Åtkomstkontroll* are the UI-relevant ones and deserve the
  same treatment.
- **Chapter 8** (*Datakrav och Sekretess*) is where our `D-*` IDs come from; not verified.
- **Bilaga D, E and F** are in the PDF and were not used: a real example agreement
  protocol, a real Director-General mediation decision, and **six actual report printouts
  from the current system**. `lib/mock/` was written from plausible invention; these are
  the real thing, and `/rapporter` in particular was designed without them.

## Reproducing

Text was extracted with `pypdf`. MI's chapter 5 table rows survive extraction; §4.3 and
§4.4 are images and do not. The comparison is a set diff between the IDs in
`bilaga-1-kravspecifikation.txt` pages 18–23, the keys of `lib/domain/requirements.ts`,
and a grep for requirement IDs under `app/` and `components/`.
