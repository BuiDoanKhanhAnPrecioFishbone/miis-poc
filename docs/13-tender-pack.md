# MI's own tender pack — what it settles

Added 2026-08-18. Until now every design conclusion rested on **our own English
rendering** of MI's documents (`requirements-v2.5-EN.txt`). These two files are MI's
originals, in Swedish, with MI's diarienummer on them. Where our rendering and these
disagree, **these win.**

| File | Searchable text | What it is |
|---|---|---|
| `tender/Avropsforfragan.pdf` | `avropsforfragan.txt` | The call-off request — how the response is evaluated and what the award criteria are worth |
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
- **Chapter 6 (§6.1–§6.11, 38 non-functional IDs) has not been diffed**, and §6.10
  *Användargränssnitt* and §6.2 *Åtkomstkontroll* are the UI-relevant ones. Neither has
  chapter 8, which is where our `D-*` secrecy IDs come from. The rest of the 50 pages has
  been read only where a question sent us there: §3.1, §4.1, §4.3, §4.4, §4.6, §16.
- **Bilaga D, E and F are unused.** The PDF contains a real example agreement protocol
  (Bilaga D), a real Director-General mediation decision (Bilaga E) and **six actual
  report printouts from the current system** (Bilaga F). `lib/mock/` was written from
  plausible invention and `/rapporter` was designed without them. This is the largest
  single opportunity left to make the prototype read as MI's own.
- **§4.5's ER diagram and "bilaga A"** — the full data model, including
  Händelselogg, Ändringslogg, Villkorsändring and Bevakningsord. `docs/12` lists our
  divergences from the information model; this is the drawing to settle them against.
  MI also notes the fields shown "är exempel och inte uttömmande".
- **Bilaga 2, 3 and 4 are not in the repo.** Bilaga 2 (Leverantörskontroll) carries
  further requirements on how the assignment is carried out; Bilaga 4 is the price form.
  Neither is UI work, but Bilaga 2 should be read by whoever writes the response.

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

### Not done yet

**Bilaga F, Rapport 2 — Avtalskonstruktioner.** MI's real report counts **employees**,
not agreements, and splits every construction three ways — Privat / Offentlig / Alla
sektorer, each as a count and a percent — and again by Arbetare / Tjänstemän. Our report
counts agreements per construction, derived from the records, which is the right
architecture but the wrong measure. Doing MI's version properly means giving an agreement
an employee count, a sector and a worker/salaried split, and deriving the table from
those — a domain change, not a data change. MI's own figures are in the PDF on page 41
when it is done: construction 4 covers 893 047 employees across all sectors, 23,5 %,
which is the largest.

**Rapport 3–6** (Avtalsrörelse, Huvudrapport, Medlare, Pensionsavtal) have not been read
in detail. `/rapporter` names them; their real layouts are on pages 43–50.
