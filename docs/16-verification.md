# Verification — what runs, and what it answers

Evidence for the tender response's **Arbetsprocesser och metoder** section, which the
call-off scores at up to SEK 500 000. Everything below exists in this repository and can
be run by anyone with a checkout. Nothing here is aspirational; where something is not
built, the row says so.

The point of writing it down is that §16 judges this criterion on *konkretionsgrad* among
other things. A claim about testing is worth what it can be shown to be.

## The four commands

```
npm test          109 unit tests over the domain layer and the mock data
npm run lint      ESLint, including the architectural rules below
npx tsc --noEmit  types, which is also what keeps the English translation complete
npm run build     production build, which fails on broken mock references
```

Plus two that need the app running: `npm run screenshots` and the axe sweep described
below.

## MI's chapter 9, requirement by requirement

| | MI asks for | Where it stands |
|---|---|---|
| **T-001** | Unit, integration and system tests before go-live, documented | **Unit: built.** 109 tests over `lib/domain/` and `lib/mock/`. Integration and system tests belong to the delivered system and are described, not built — there is no database or IdP to integrate against yet |
| **T-002** | Testing against anonymised or fictitious protocols and agreements representing variations in the Swedish landscape | **Built.** `lib/mock/` holds three datasets with real party names — Teknikföretagen, IF Metall, Almega, Unionen, Kommunal, Seko, Sveriges Lärare — across private, municipal and industry sectors. The sample protocol is MI's own from Bilaga D. A test asserts the variation rather than assuming it |
| **T-003** | Test data including edge cases, such as entirely new agreements with no previous version | **Built.** The `quiet` dataset is deliberately near-empty so empty states are designed rather than discovered; `peak` is the same register under load. US-02's brand-new agreement is the named edge case |
| **T-004** | Regression testing on system or AI-model updates | **Partly built.** The unit suite, the lint rules and the accessibility sweep run on every change and have caught real regressions. Regression against an *AI model* update needs the model, and is described |
| **T-005** | A UAT environment | **Described.** The Vercel deployment is the current equivalent — every push is reviewable at a URL — but a real UAT environment with MI's own data is delivery work |
| **T-006** | Every Ska-krav verified and approved by MI before final delivery | **Groundwork built.** Both requirement chapters are diffed against MI's own tables, every requirement ID on screen resolves to MI's own sentence, and the traceability layer exists so a requirement can be walked to the interface that satisfies it. Approval itself is MI's act |
| **T-007** | Migration verified for data quality and completeness | **Not started.** Delivery work, and it needs W3D3 and the Access database |
| **T-008** | Production verification by MI after go-live | **Not started.** Delivery work |

## The three test layers

**Logic.** Unit tests over `lib/domain/`, which by architectural rule imports nothing — no
React, no Next, no data access — so the business rules are plain functions over plain
values and need no harness. The suite covers FR-012's colour derivation and all four of
its branches, FAI-002 and FH-001's adjusted-versus-untouched rule, FA-021's empty-field
rule, FF-004's meeting phases, FF-005's coordinated-demand backing, FP-002's
name-at-a-date, §4.1's AI catalogue — that the four functions MI names are the four
present, that every requirement ID they cite resolves, that no screen claims AI a
requirement does not put there, and that NFÅ-003 filters the review queue by write access
so an officer is never shown work they cannot clear — and FAI-004's watchword matching — case-insensitivity, longest-term
precedence, and the guarantee that rejoining the segments reproduces the line exactly. It also reconciles MI's own report figures against their printed totals,
which is how a transcription error from a scanned page gets caught.

**Design.** Enforced by the build rather than by review, because a convention nobody can
break is worth more than one everybody agrees with:

- A raw `<button>` or `<table>` under `app/` fails lint. Screens use the primitives or
  they do not ship.
- An import of `lib/mock/` from anywhere but `lib/data/` fails lint. The data seam holds.
- A missing or misspelt translation key fails `tsc`, because the English dictionary is
  typed as the Swedish one. The second language cannot silently rot.
- A dangling reference in the mock data fails `next build`.

**Accessibility.** NFUI-003 makes WCAG 2.1 AA a requirement rather than a preference. axe
runs across every route at five width and language combinations, currently 0 violations,
alongside a check that no route scrolls horizontally at any width from 375 to 1920 in
either language. Both have caught defects that review missed — most recently a page-wide
horizontal scrollbar caused by screen-reader-only text escaping its container, which was
live on the deployed build and invisible to the eye.

## Why each build is reasonable

Every change carries three things, and the repository is the record:

**A requirement.** Each screen renders the IDs it satisfies, behind a toggle, and each ID
resolves to MI's own sentence. A feature that cannot name a requirement does not get
built — that test removed a general AI assistant and a confidence score from this
prototype, both of which looked useful and neither of which MI asked for.

**A decision, with its reasoning.** `docs/09`, `docs/11` and `docs/14` log the material
choices against two sources — the sketches, and MI's requirements — and record which won
and why. Where the two disagree the requirement wins, and the row says so.

**Evidence.** Commit messages state what was verified and how, with figures rather than
adjectives: *0 violations across 50 runs*, *page movement 0px, measured*, *distinct input
positions equal the layout row count at every width*.

## What this does not claim

The prototype has no database, no authentication and no AI model, so anything downstream
of those is described rather than demonstrated. Integration tests, the UAT environment,
migration verification and production verification are delivery work. Saying so is part of
the point: a bid that claims everything is already true invites exactly the question it
cannot answer.
