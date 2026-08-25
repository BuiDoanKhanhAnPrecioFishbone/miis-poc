# MI's own tender pack — what it settles

Added 2026-08-18. Until now every design conclusion rested on **our own English
rendering** of MI's documents (`requirements-v2.5-EN.txt`). These two files are MI's
originals, in Swedish, with MI's diarienummer on them. Where our rendering and these
disagree, **these win.**

| File | Searchable text | What it is |
|---|---|---|
| `tender/Avropsforfragan.pdf` | `avropsforfragan.txt` | The call-off request — how the response is evaluated and what the award criteria are worth |
| `tender/Bilaga_2_Leverantorskontroll.pdf` | `bilaga-2-leverantorskontroll.txt` | Arrived 2026-08-21. **§3.5 is the scored criterion's own instruction** — three roles, four elements, thirteen prescribed bullets, six named judgements. §3.4 arbetsprocesser, §3.6 the presentation, §3.7 IP, §5 price. See `docs/17-scenario-criterion.md` for the bullet-by-bullet diff |
| `tender/Bilaga_1_Kravspecifikation.pdf` | `bilaga-1-kravspecifikation.txt` | **This is "Appendix 1."** 50 pages, dated 2026-06-04, diarienummer 2026/0059. The requirement tables, the roles, the system sketch and the registration user flow |

`Bilaga 1` is the document `docs/12-source-documents.md` and half of `docs/09` have been
citing second-hand as "Appendix 1 §4.3 / §4.4". It is no longer missing.

Text was extracted with `pypdf`; the PDFs are authoritative. **§4.3 and §4.4 are
diagrams, so they do not appear in the `.txt` at all** — read them from the PDF.

---

## The award criteria, verbatim

From §16 of the call-off request. This is the arithmetic the whole prototype exists to
serve, and it checks out exactly as `CLAUDE.md` states it:

> Rollbaserade användarscenarier och användargränssnitt (max 1 000 000 kr i mervärde)

Alongside Arbetsgrupp (500 000), Arbetsprocesser och metoder (500 000) and Muntlig
presentation (500 000) — 2 500 000 total, of which ours is 40 %. Evaluation is
`Jämförelsetal = anbudssumma – erhållet mervärde`.

**What is new is the scale.** There is no sliding scale; the award is banded:

| Band | Share of the maximum | Our criterion |
|---|---|---|
| Mycket högt mervärde | 100 % | 1 000 000 kr |
| Högt mervärde | 75 % | 750 000 kr |
| Visst mervärde | 50 % | 500 000 kr |
| Begränsat mervärde | 25 % | 250 000 kr |
| Inget mervärde | 0 % | 0 kr |

The gap between "high" and "very high" is **SEK 250 000**, and nothing in between. And
MI names what it weighs:

> Vid bedömningen kommer särskild hänsyn att tas till bland annat **relevans, tydlighet,
> konkretionsgrad, genomförbarhet** samt i vilken utsträckning redovisningen visar
> **förståelse för uppdragets förutsättningar och behov**.

Worth reading against what we have built. *Konkretionsgrad* and *genomförbarhet* are
served by a running prototype rather than a slide deck; *tydlighet* by the requirement-ID
layer; *förståelse för uppdragets förutsättningar* by the Swedish-first interface and the
real party names. None of those was chosen with this sentence in hand — it is a
retrospective check, and it passes.

---

## What it confirms

Three open questions in this repo are now closed, and all three close in our favour.

**1. The navigation (§4.3 Systemskiss).** The module boxes read *Avtalsregistrering ·
Partshantering · Dokumenthantering · **Sök & Rapporter** · AI-assisterad reg. ·
Ändringslogg · Rapportuttag · Medlingshantering (Medlare, partsträffar)*, plus a greyed
*Avtalsregistrering — Pension-, Försäkring-, Övr. avtal* for Stage 2.

*Sök & Rapporter* is one box, which is what `docs/12` corrected the nav to on the
strength of the guide alone. *Medlingshantering* subsuming Medlare and Partsträffar is
the shape `NAV_TREE` already has. **No nav change needed.**

**2. The five registration steps (§4.4).** The flow is a diagram, and it runs:

> Ladda upp avtalsprotokoll → AI-analys *(letar avtalsområde, avtalsnamn, parter)* →
> Formulär: Registrera nytt/uppdatera avtal *(förifyllt)* → Manuell justering/godkännande
> → **Finns avtalet i MIIS?** → *(Nej)* Formulär: Registrera nytt avtal → AI-analys
> *(datum, löptid, uppsägn.)* → Formulär: Registrera löneavtal/allmänna villkor *(inkl.
> lönerevision)* → Manuell justering/godkännande → Avtalsprotokoll kopplat → Klart

Our five stepper labels were written from a second-hand summary and are close enough to
keep:

| Our label | MI's box |
|---|---|
| 1. Ladda upp | Ladda upp avtalsprotokoll |
| 2. AI-analys | AI-analys (both passes) |
| 3. Avtal (matchat) | Finns avtalet i MIIS? → the *Ja* branch |
| 4. Löneavtal / Allmänna villkor | Formulär: Registrera löneavtal/allmänna villkor |
| 5. Koppla protokoll | Avtalsprotokoll kopplat |

Two things the diagram settles that we had reasoned to:

- **"Manuell justering/godkännande" appears twice** — once after the identification form
  and once after the wage-agreement form. Approval is per form stage, not per field, and
  there are two of them. That is exactly the shape `/registrera` has: *Godkänn
  AI-förslagen* on the AI panel, *Godkänn och koppla protokoll* at the save. The
  nine-decision version this repo removed in `docs/09` would have contradicted MI's own
  diagram.
- **The decision node is real.** *Finns avtalet i MIIS?* with a *Nej* branch to
  *Registrera nytt avtal* is US-02, and our step-3 label already says *(matchat)*, i.e.
  it names the *Ja* branch it is on rather than pretending the branch does not exist.

**3. The eight roles (§3.1).** Systemadministratör, Behörighetsadministratör,
Avtalsadministratör/Handläggare, Medlingsadministratör, Medlaradministratör,
Statistikanvändare, Allmänhetens dator — seven marked *Ska* — plus the external mediator
as *Option, Steg 2* in §3.2. `lib/domain/role.ts` has all eight, with `mediator` marked
as the option. **No change needed.**

Also confirmed: §4.6 requires a web client on modern browsers with no local install, a
responsive UI, **WCAG 2.1 AA**, SQL Server, and Försäkringskassan operating it on-prem
with a Model as a Service offer — the AI seam `lib/data/extraction.ts` was written for.

---

## Still open

- **Chapter 5 has now been diffed** — see `docs/14-chapter-5-diff.md`. Nothing was
  invented or renamed, one tooltip overstated its requirement, and nine Stage 1
  requirements had no screen. All fixed; Stage 1 coverage is complete.
- **Chapter 6 has now been diffed** — see `docs/15-chapter-6-diff.md`. 37 requirements,
  nothing invented, and §6.10 *Användargränssnitt* turned out to have no tag on any
  screen despite being the three requirements the award criterion rests on. Fixed.
- **Chapters 7, 8 and 9 have not been diffed.** Chapter 8 (*Datakrav och Sekretess*) is
  where our `D-*` IDs come from and is the one with UI consequences. The rest of the 50
  pages has been read only where a question sent us there: §3.1, §4.1, §4.3, §4.4, §4.6,
  §16.
- **Bilaga D, E and F are unused.** The PDF contains a real example agreement protocol
  (Bilaga D), a real Director-General mediation decision (Bilaga E) and **six actual
  report printouts from the current system** (Bilaga F). `lib/mock/` was written from
  plausible invention and `/rapporter` was designed without them. This is the largest
  single opportunity left to make the prototype read as MI's own.
- **§4.5's ER diagram and "bilaga A"** — the full data model, including
  Händelselogg, Ändringslogg, Villkorsändring and Bevakningsord. `docs/12` lists our
  divergences from the information model; this is the drawing to settle them against.
  MI also notes the fields shown "är exempel och inte uttömmande".
- **Bilaga 3 arrived 2026-08-21** — the W3D3 user manual, now in
  `tender/Bilaga_3_W3D3_Anvandarmanual.pdf` with a `.txt` beside it. What it settles is in
  `docs/17-scenario-criterion.md`. Avropsförfrågan §18.3 sets its limit in MI's own words:
  *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen av det nya
  systemet."* Migration source and process background, never a design template.
- **Bilaga 2 and 4 are still not in the repo, and Bilaga 2 now matters most.** §18.2 says
  it carries *"kompletterande krav och beskrivning av uppdragets omfattning och innehåll"*,
  and the detailed instruction for our own scored criterion — three named roles, four
  elements each — is not in Avropsförfrågan §16, so it is almost certainly there. We are
  building the most heavily weighted deliverable against a paraphrase until it arrives.
  Bilaga 4 is the price form.

## How to use these

Same standing as the other three sources: check work against them before designing a
screen, and when our shape differs, MI's document wins and the divergence is logged.

---

## Bilaga D, E and F in the mock data (2026-08-18)

The appendices are scanned pages, so they carry no extractable text — they were read as
images out of the PDF. What went in:

**Bilaga D — the example agreement protocol.** MI's is an Industriavtalet agreement
between Industriarbetsgivarna and Unionen. Its *shape* is what the sample protocol on
`/registrera` now follows: the numbered sections (*1 Avtalets giltighetstid, 2 Fredsplikt,
3 Överenskommelsens omfattning*), the *"som sades upp den … ska gälla med angivna
ändringar och tillägg"* clause, the lettered appendix list, and the place-and-date line
that closes it. Parties, area and dates stay ours, so the document still describes the
agreement the screen registers.

**Bilaga F, Rapport 1 — Avtal, Allmänheten.** MI's example is *our* agreement: Almega
Tjänsteförbunden / Seko, Service- och kommunikationsfacket, area Kommunikation. Two
things came from it. The validity period is now MI's own — **2025-08-01 – 2027-07-31**,
carried through the extraction, the wage panel and the general terms — and it is a better
fit than the invented one, because an agreement running out in mid-2027 is exactly what
the 2027 round renegotiates. And the protocol's file name follows MI's convention,
`Seko Kommunikation 2025-27.pdf`: party, area, period, with spaces.

**Bilaga E — the Director-General decisions.** Both examples are Spårtrafik disputes,
which is the mediation case we already model. It names three mediators —
Gunilla Runnquist, Bengt Huldt and **Gerald Lindberg**; we had the first two and have
added the third. The decisions are signed by MI's Director-General Irene Wennemo and by
Per Ewaldsson, and copied to *Medlarna*, the employer organisation and each union
separately.

### All six read (2026-08-20)

Pages 39–50 were extracted as images and read. What they settle:

**Every report is a selection screen and a result.** Bilaga F says so in its first line —
*"För varje rapport visas urvalsbild och resultat"* — and each urvalsbild is a W3D3 form
with **Typ**, **Välj rapport**, **Ärendeserie**, a format dropdown (PDF), the criteria,
and *Generera rapport*. The criteria are **not the same per report**: Rapport 1, 4 and 5
take three (AGO, ATO, Avtal); Rapport 2 and 3 take nine, with *Centralorganisation*
appearing twice, once per side; Rapport 6 splits its criteria into three blocks. Every
printout then repeats them as an **Urvalskriterier** block, with unset criteria reading
*Alla*. That whole shape is now `REPORTS` in `lib/domain/report.ts` and `ReportRunner`.

**Rapport 2 — Avtalskonstruktioner** was already built from MI's published figures
(`lib/mock/constructions-report.ts`), against an earlier note in this file saying it was
not. It counts employees, splits Privat / Offentlig / Alla sektorer and again by Arbetare
/ Tjänstemän, and the figures are MI's own, not derived — the report covers 3 797 764
employees across the whole labour market and could never come out of a sample. The screen
now says so where the selection sits, instead of letting a criterion appear to narrow a
transcription.

**Rapport 3 — Avtalsrörelse** is agreements and employees by the **month the agreement
expires**, split into kvarstående / nytecknade / nytecknade efter medling, as counts and
percentages, with a bar chart per half. Now built and **derived** from the register
(`bargainingRoundReport`), which is the opposite choice from Rapport 2 and for a stated
reason: this one counts the agreements MI holds. It needed an employee count on the
agreement, which MI's own Huvudrapport carries as *Avtalets omfattning: Anställda*.

**Rapport 4 — Huvudrapport** is the complete record for **one** agreement: basfakta,
omfattning, lön, arbetstid, pensionsavtal, ledighet, löneavtal, lönerevision. It has no FR
of its own because it is the agreement view, printed — so the catalogue points it at
`/avtal/[id]` rather than duplicating it. That closes the gap flagged on 2026-08-19.

**Rapport 5 — Medlare** is *not* a mediator report. It is an agreement print for
**mediators** — löptider, uppsägning, prolongering, linked protocols, plus "Övriga avtal
som [AGO] tecknar". Together with Rapport 1 it is FR-011's two audiences.

**Rapport 6 — Pensionsavtal och övriga avtal** lists agreements with their pension and
other agreements, selected on the two sides separately.

**Centralorganisation is a party property.** It is not in FP-001's sentence, but MI
selects six of its reports on it and the Huvudrapport prints the chain — "Almega ·
Svenskt Näringsliv · Privat" against "6F Fackförbund i samverkan · LO". Added to `Party`.
