# Chapter 6 diff — our non-functional IDs against MI's own

Run 2026-08-18 against `docs/requirements/tender/Bilaga_1_Kravspecifikation.pdf`
chapter 6 (*Icke-funktionella krav*, §6.1–§6.11, pages 24–27). The companion to
`docs/14-chapter-5-diff.md`, and the last open item from `docs/13`.

**37 requirements across eleven sections.** MI uses the same `NF*-nnn` scheme we do.

## Integrity: the same three checks, all clean

| Check | Result |
|---|---|
| Rendered on a screen but no sentence in `requirements.ts` | **none** |
| In `requirements.ts` but nowhere in MI's chapter 6 | **none** |
| Rendered but absent from MI's document | **none** |

Nothing invented, nothing renamed, no tag without a tooltip behind it — the same result
chapter 5 gave.

## The finding that mattered

**§6.10 *Användargränssnitt* had no tag on any screen.** It contains exactly three
requirements, and they are the three that govern the award criterion this entire prototype
exists to win:

| | | |
|---|---|---|
| NFUI-001 | Web-based, reached through modern browsers with no local install | true, untagged, **no sentence at all** |
| NFUI-002 | Responsive user interface | true, untagged |
| NFUI-003 | WCAG 2.1 level AA | true, verified across 50 axe runs, untagged |

All three were satisfied. None of them was *said* anywhere an evaluator tracing
requirement → interface would look. NFUI-002 and NFUI-003 appeared only in source
comments, which no evaluator reads, and my first measurement counted those as coverage —
a flaw in the measurement, not in the build. Excluding comments and `requirements.ts`
itself brought the real figure down from 15 to 13.

They now sit on the start page beside FS-001, because they are properties of the client
rather than of any one screen, and the start page is where an evaluator lands.

## What was fixed

- **22 requirements had no sentence.** All 37 do now, so `requirements.ts` finally
  contains the whole specification rather than the part we had drawn.
- **NFUI-001, NFUI-002, NFUI-003 tagged** on the start page.

| | Before | After |
|---|---|---|
| Chapter 6 with a sentence | 15 of 37 | **37 of 37** |
| Chapter 6 rendered on a screen | 13 | **16** |

## The 21 that remain unshown, and why that is correct

Unlike chapter 5, most of chapter 6 is not addressed to an interface at all. Counting them
as a coverage gap would be a category error, so they are listed here instead:

| Group | IDs | Why no screen can carry it |
|---|---|---|
| Secure development | NFS-001–004 | OWASP practice, dependency SLAs, no hard-coded secrets, a disclosure programme — obligations on the supplier's process |
| Operations | NFT-001–003 | 99 % uptime in office hours, backup routines, an 8-hour recovery time |
| Incidents | NFI-001–003 | NIS2 and ISO/IEC 27001 process, 24-hour reporting, 5-day root-cause report |
| Ownership | NFU-001–004 | MI owns the system outright, source and documentation handed over, open standards, documented for another supplier to take over |
| Encryption | NFK-001 | TLS 1.2 or higher |
| Architecture | NFA-001 | No direct or indirect dependency on external cloud services |
| Migration | NFM-001–003 | W3D3 and the Access database migrated with data quality verified |
| Capacity | NFP-001, NFP-004 | No ceiling on the number of agreements; scalable without an architectural rebuild |

These belong in the tender **response text**, not on a screen. Worth saying plainly to
whoever writes it: chapter 6 is where the bulk of the specification's obligations live,
and only three of its thirty-seven are ours to draw.

`NFP-001` and `NFP-004` are the two arguable cases — a result count can gesture at
capacity — but a mockup asserting "no ceiling" would be claiming something it cannot
show, which is the failure mode both diffs exist to prevent.

## Coverage across both chapters

| | MI's total | Shown on a screen |
|---|---|---|
| Chapter 5 — functional | 72 | 68 (the four missing are MI's own *Steg 2*) |
| Chapter 6 — non-functional | 37 | 16 (21 are supplier or infrastructure obligations) |

Every ID in either chapter now has a sentence behind it, and no tag anywhere in the
application points at something MI did not write.

## Not covered

Chapter 7 (*Leverantörskrav*), chapter 8 (*Datakrav och Sekretess* — where our `D-*` IDs
come from) and chapter 9 (*Testning och verifiering* — the `T-*` IDs) have not been
diffed. Chapter 8 is the one with UI consequences and would be the next to do.
