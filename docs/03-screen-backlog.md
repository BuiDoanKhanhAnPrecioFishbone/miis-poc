# Screen backlog

Updated 2026-08-17, after the UX-review update plan.
**8 designed · 8 stubs.** Priority is by bid value, not by menu order.

Legend: ✅ designed · 🟡 stub with requirement list only · ⬜ not in the mockup

**Design freeze 2026-08-21.** Anything unfinished then is cut, not rushed. Three
finished screens score better than six half-finished ones — the criteria are *clarity,
concreteness, feasibility*.

---

## Designed — improve, don't rebuild

| # | Page file | Route | Screen | Scenario | Status |
|---|---|---|---|---|---|
| 1 | `app/(miis)/page.tsx` | `/` | Startsida, rollanpassad | FS-001 | ✅ |
| 2 | `app/(miis)/registrera/page.tsx` | `/registrera` | Registrera avtalsprotokoll med AI-stöd | US-01 | ✅ |
| 3 | `app/(miis)/medling/[id]/page.tsx` | `/medling/M-2027-12` | Medlingsärende från GD-beslut | US-07 | ✅ |
| 4 | `app/(miis)/sok/page.tsx` | `/sok` | Sökbyggaren | US-11 | ✅ |
| 5 | `app/(miis)/rapporter/page.tsx` | `/rapporter` | Rapporter — Konjunkturlönerapporten m.fl. | US-17, FR-008 | ✅ |
| 6 | `app/allmanheten/page.tsx` | `/allmanheten` | Publik dator | US-14 | ✅ |
| 7 | `app/(miis)/dokument/page.tsx` | `/dokument` | Dokument | FD-001 | ✅ |
| 8 | `app/(miis)/medling/page.tsx` | `/medling` | Medlingsärenden — översikt | US-09 | ✅ |

## Done since the last version of this backlog

- ~~Role switcher~~ — all eight roles, now in the demo bar above the product chrome
  rather than inside the header, and **the navigation itself changes with the role**
  (`RoleInfo.nav` + `lib/domain/nav.ts`). The award criterion is *role-based user
  scenarios and user interface*; a menu that changes is the most direct evidence of it.
- ~~Status colour + text label~~ — `StatusDot` carries colour, **shape** (filled circle /
  filled square / hollow ring) and a label. The label is now shown visibly in the start
  page table, which was the open question here.
- ~~The AI-got-it-wrong state~~ — `/registrera` opens with one proposal already rejected
  (the extraction read *LO* where the protocol says *Seko*), the wrong value struck
  through beside the case officer's correction, and the registration blocked from being
  marked complete while any proposal is unreviewed.
- ~~Source-linked AI proposals~~ — selecting a proposal highlights and scrolls to the
  passage in the protocol it was read from. FAI-001 extracts *from* the protocol and
  FAI-004 already highlights in it; linking the two makes manual review fast rather than
  tedious, which is the point of FAI-002.
- ~~FR-008 Konjunkturlönerapporten~~ — built, with the three things the requirement names:
  status column (registrerat / delvis registrerat / ej registrerat), a protocol link
  **even when registration is incomplete**, and export tracking per agreement.
- ~~Nested grouping in Sökbyggaren~~ — `(A ELLER B) OCH C` is expressible, the expression
  is written out, and the selection sits above the results as removable chips.
- ~~i18n~~ — Swedish default, complete English behind the demo bar. `en.ts` is typed
  against `sv.ts`, so a missing key fails the build.
- ~~Requirement-ID toggle~~ — off by default, with the requirement sentence on hover and
  zero layout shift when toggling.
- ~~Session timeout (NFÅ-002)~~ — modal at 28 minutes, keyboard-trapped, announced, with a
  manual trigger in the demo bar for the presentation.
- ~~The AI assistant~~ — built, as §4.1 describes it rather than as a chatbot. A drawer
  from the header carrying the four functions §4.1 names, the queue of proposals waiting
  for approval (which FAI-002 implies must exist and which nothing showed before), and
  MI's own stated limits on what the AI may not do. `lib/domain/ai.ts` is the catalogue
  and it is tested; NFÅ-003 filters the queue by write access, and a role with no AI
  screen gets no launcher. The earlier general assistant — a prompt box on eleven
  screens — stays removed: it is the thing this replaces, not the thing it restores.
- ~~Accessibility evidence~~ — see `docs/accessibility/`. axe-core, zero violations.
- ~~Screenshots~~ — `npm run screenshots`, generated from the running app at 1440 px, in
  both languages and with requirement tags on and off.

## P1 — build these next, they carry scenarios with real weight

| # | Route | Screen | Scenario | Requirements | Why it matters |
|---|---|---|---|---|---|
| 9 | `/partstraffar` | Partsträffar | US-08 | FF-004, FF-005, FSD-002, FD-001, FAI-004 | The one genuinely distinctive screen: an **interactive view used live during a meeting** with a party. Nobody else's mockup will have this. Before / during / after modes. |
| 10 | `/parter` | Parter | US-03 | FP-001–006, FH-001 | Name changes propagate to current agreements but **not** historical ones. Designing that time-awareness visibly is a strong signal of domain understanding. |
| 11 | `/avtal` | Avtal — lista och avtalsvy | US-19, FA-020 | FA-019, FA-020, FR-012, FA-015, FA-016 | The most-used view in the real system. "Show the agreement as it was valid at a given date" is the interaction to nail. |
| 12 | `/medlare` | Medlarregister | US-10 | FF-009, FE-001, D-004 | Statistics per mediator (year, agreement area, ettan/tvåan) as decision support for appointments. |

## P2 — worth having, cheaper to build

| # | Route | Screen | Scenario | Requirements |
|---|---|---|---|---|
| 13 | `/forhandlingar` | Förhandlingar | US-16 | FF-001–003, FH-002 |
| 14 | `/market` | Märket | US-06 | FM-001–003, FA-012 |
| 15 | `/administration` | Administration — logg och bevakningsord | US-12, US-13 | NFL-001–004, FAI-004 |
| 16 | `/administration/anvandare` | Användare och roller | US-12 | NFÅ-001, NFÅ-003, NFÅ-005 |

## P3 — only if there is time

| Screen | Scenario | Note |
|---|---|---|
| Medlarvy, extern | US-15 | Stage 2 option. Mention in the text, don't build. |
| E-postmall med djuplänk | FE-002 | One small mock; the reminder and scheduling flows already reference it. |

---

## Requirement coverage gaps

Things the spec is explicit about that still have **no home in the UI**:

- **FH-003 Snapshot ("bokslut")** — referenced in `/sok` and `/rapporter`, but the
  interaction of moving through time is not designed. High conceptual value.
- **FA-022 Reminders** — can now be *seen* on the start page and on the
  Konjunkturlönerapporten rows, but the "Sätt påminnelse" control does not open anything.
- **FAI-004 Watchword table** — highlighting works in `/registrera`, but the customisable
  table itself (US-13) is undesigned.
- **D-001 / D-002 Confidentiality** — the marker, the masked field and the "still counted
  in statistics" rule are now visible in four places, but **US-05 has no screen of its
  own**: the act of setting the mark exists only as a toggle in `/registrera`.
- **FA-013 Minimum wages by occupational group** — in the data model, not on a screen.

## Suggested order for the days that remain

1. `/partstraffar` (P1 — the distinctive screen)
2. `/parter` with history and time-awareness (P1)
3. `/avtal` with "valid at date" (P1)
4. Snapshot interaction, shared by `/sok` and `/rapporter` (gap, high concept value)
5. US-05 confidentiality as its own flow (gap)
6. Whatever P2 fits before the freeze

Then: the demo script for week 35, and a screenshot pass after the last change.
