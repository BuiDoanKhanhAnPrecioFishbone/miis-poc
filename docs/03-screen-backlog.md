# Screen backlog

Status as bootstrapped from the CEO's Lovable export, 2026-08-13.
**4 designed · 8 stubs.** Priority is by bid value, not by menu order.

Legend: ✅ designed · 🟡 stub with requirement list only · ⬜ not in the mockup

---

## Already designed — improve, don't rebuild

| # | Route | Screen | Scenario | Status |
|---|---|---|---|---|
| 1 | `/` | Startsida | FS-001 | ✅ |
| 2 | `/registrera` | Registrera avtalsprotokoll med AI-stöd | US-01 | ✅ |
| 3 | `/medling/arende` | Medlingsärende från GD-beslut | US-07 | ✅ |
| 4 | `/sok` | Sökbyggaren | US-11 | ✅ |

These four match the sketches in `docs/sketches/` and chapter 9 of the spec. They are
the strongest part of the bid. Improvements worth making, in order:

1. **Role switcher on the start page.** FS-001 *requires* the start page to adapt per
   role, and the award criterion is literally called "role-based user scenarios". Right
   now the mockup shows one role. A visible demo control that switches between
   Avtalsadministratör / Medlingsadministratör / Medlaradministratör /
   Statistikanvändare / Systemadministratör, changing the dashboard content, is the
   single highest-value change in this repo. It also gives the oral presentation its
   opening move.
2. **The AI-got-it-wrong state** in `/registrera`. FAI-002 says nothing is saved
   automatically and every proposal needs manual approval. Showing a *rejected* AI
   proposal and the correction path proves we understood that requirement, not just
   the happy path.
3. **Status colour + text label everywhere** (FR-012). Green/red/blue alone fails WCAG
   and fails the requirement's intent.

## P1 — build these next, they carry scenarios with real weight

| # | Route | Screen | Scenario | Requirements | Why it matters |
|---|---|---|---|---|---|
| 5 | `/partstraffar` | Partsträffar | US-08 | FF-004, FF-005, FSD-002, FD-001, FAI-004 | The one genuinely distinctive screen: an **interactive view used live during a meeting** with a party. Nobody else's mockup will have this. Before / during / after modes. |
| 6 | `/medlare` | Medlarregister | US-10 | FF-009, FE-001, D-004 | Statistics per mediator (year, agreement area, first/second chair) as decision support for appointments. Shows we read Appendix F. |
| 7 | `/parter` | Parter | US-03 | FP-001–006, FH-001 | Name changes propagate to current agreements but **not** historical ones. Designing that time-awareness visibly is a strong signal of domain understanding. |
| 8 | `/avtal` | Avtal — lista och avtalsvy | US-19, FA-020 | FA-019, FA-020, FR-012, FA-015, FA-016 | The most-used view in the real system. "Show the agreement as it was valid at a given date" is the interaction to nail. |

## P2 — worth having, cheaper to build

| # | Route | Screen | Scenario | Requirements |
|---|---|---|---|---|
| 9 | `/forhandlingar` | Förhandlingar | US-16 | FF-001–003, FH-002 |
| 10 | `/market` | Märket | US-06 | FM-001–003, FA-012 |
| 11 | `/administration` | Administration — logg, behörigheter, bevakningsord | US-12, US-13 | NFL-001–004, NFÅ-005, FAI-004 |
| 12 | `/medling` (list) | Medlingsärenden — översikt | US-09 | FF-006, FF-010, FR-012 |

`/medling` already has a working list; it needs the **mediation outcome** fields from
FF-010 (type of mediation, industrial action, type of industrial action, lost working
days, number of affected employees).

## P3 — only if there is time

| Screen | Scenario | Note |
|---|---|---|
| Publik rapportvy (`/allmanheten`) | US-14 | No login, IP-restricted, confidentiality-marked data hidden. A separate, deliberately stripped-down UI. Cheap to build, and it shows we handled a role most bidders will forget. |
| Rapportgenerator | US-17 | Could live as a tab inside `/sok` rather than its own route. |
| Medlarvy, extern | US-15 | Stage 2 option. Mention in the text, don't build. |

---

## Requirement coverage gaps

Things the spec is explicit about that currently have **no home in the UI**:

- **FH-003 Snapshot ("bokslut")** — reconstruct the data as it looked on a given date.
  Referenced in `/sok` but the interaction isn't designed. High conceptual value.
- **FA-022 Reminders** — appears on the start page but there's no way to *set* one.
- **FR-008 Konjunkturlönerapporten view** — the spec describes this view in unusual
  detail (status column, protocol link even when incomplete, which agreements were
  previously exported). Specific enough that designing it exactly earns points.
- **FAI-004 Watchword table (bevakningsord)** — highlighting works in `/registrera`,
  but the customisable table itself (US-13) is undesigned.
- **D-001 Confidentiality marking** — US-05 has no screen at all.
- **FE-002 E-mail with deep link into the system** — worth one small mock.

## Suggested order for the days you have

1. Role switcher on the start page (P0 — biggest single win)
2. `/partstraffar` (P1 — the distinctive screen)
3. AI-rejection state in `/registrera` (P0 — proves FAI-002)
4. `/parter` with history/time-awareness (P1)
5. `/avtal` with "valid at date" (P1)
6. `/medlare` (P1)
7. Snapshot interaction in `/sok` (gap, high concept value)
8. Whatever P2 fits before the deadline

Then: screenshots at 1440px for the tender document, and the demo script for week 35.
