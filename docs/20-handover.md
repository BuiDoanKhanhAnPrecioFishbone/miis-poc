# Handover — where this stands, and what must not be undone

*Written 2026-08-21 after Bilaga 2 arrived; **updated 2026-08-22**. Read this
after `CLAUDE.md` and before touching anything.*

`CLAUDE.md` carries the **rules**. This file carries the **state**: what is done,
what is decided and why, what is left, and who owns it. If the two ever
disagree, `CLAUDE.md` wins for how to build and this file wins for what is true
today.

---

## The clock

| | |
|---|---|
| Avropssvar due | **2026-08-25** |
| 15-minute presentation at MI | week 35, Drottninggatan 89 |
| Tilldelningsbeslut | 2026-09-08 |
| Last day for appeal | 2026-09-22 |
| Steg 1 finished | before **2027-04-01** |

The criterion this repository exists to win is **Bilaga 2 §3.5**, *Rollbaserade
användarscenarier och användargränssnitt*, worth **SEK 1 000 000 of 2 500 000**.

**The address to send an evaluator to is `miis-poc.vercel.app/genomgang`.** It is
the guided walkthrough, and it is what the 15-minute presentation runs from.

---

## What the response is made of

| Document | What it is | State |
|---|---|---|
| `docs/18-role-scenarios.md` | The scored §3.5 section — three roles, four elements each, in MI's own bullet order | **Drafted, English** |
| `docs/19-arbetsprocesser.md` | The §3.4 ska-krav — method, collaboration, timeline | **Drafted, English** |
| `docs/16-verification.md` | Evidence for both: what runs, mapped to MI's chapter 9 | Current |
| `docs/17-scenario-criterion.md` | The plan, and the bullet-by-bullet diff against §3.5 | All items closed |
| `screenshots/` | 64 shots × Swedish and English, generated from the running build | **Not in git** — see below |

Both drafts are **English with Swedish terms already in place**, so rendering
them into Swedish is a translation pass, not a rewrite.

**`screenshots/` is gitignored, and `docs/18` cites fourteen of the files by
name.** So the images the scored section depends on exist on whichever machine
last ran the pass and nowhere else. They were last regenerated **2026-08-22**,
after the AI palette, the tab redesign, the required-field marker, the print
rework, the agreement record and the three editable registers — anyone
assembling the response either copies them from that machine or reruns
`npm run screenshots` (both languages) against a dev server. Any UI change
invalidates them silently: nothing fails, the document just shows a system that
no longer exists.

---

## Standing decisions — do not quietly reverse these

Each of these was argued at least once and re-argued after pushback. If a future
session wants to change one, that is fine, but it needs to be a decision rather
than a drift.

**The AI is §4.1's four functions, plus a question box that never composes.**
MI's §4.1 lists four named functions and nothing else; neither Bilaga 1 nor
Bilaga 2 contains the words *chatt*, *chatbot*, *dialog*, *konversation* or
*naturligt språk* — that was searched, not assumed. The drawer's *Fråga* tab
answers by **running a query the register already supports** and showing the rows
it counted. It does not generate prose about collective agreements, because an
authority cannot publish an answer it cannot account for. Asking is reading, so
nothing there writes; the four functions that write keep approve and reject,
which is where FAI-002's guarantee lives. **A free prompt box was asked for three
times and declined three times, with the evidence each time.** If the manager
still wants generation, that is a product decision — build it, and say so
explicitly in the response rather than leaving it implied.

**§4.1's third function *is* a text input, and it is built.** *"Via
fritextsökning i protokoll och avtal ska systemet kunna identifiera och föreslå
registrering av specifika skrivningar."* `ClauseSearch` on `/registrera`. That is
the answer whenever someone asks for a box to type into.

**§3.5 and Bilaga 1 §3.1 contradict each other about who administers users.**
§3.1 gives Systemadministratör *"full åtkomst … (exkl. behörigheter)"*; §3.5's
Scenario 1 asks that role to create users and assign roles. **Never resolve it by
widening `system-admin`** — that breaks §3.1 and NFÅ-005. All five bullets are
demonstrated and the walkthrough switches role where §3.1 requires, saying so on
the control. That is evidence for *"leverantörens förståelse för verksamhetens
krav"*, one of §3.5's six named judgements.

**No requirement text in the product view.** Requirement IDs, § references and
appendix names live on the `miis_reqtags` layer or in a `Rationale`. A system MI
will actually use does not argue with its user about the specification. There is
a render-time sweep for this — see below — and it currently returns zero.

**Publication is an act, not a property.** `isPublished` gates the public
interface and `mayPublish` refuses a registration that is not complete and
signed. A half-registered agreement on the public computer would be the authority
publishing a draft.

**The current system is not a design template.** Avropsförfrågan §18.3:
*"Det gamla systemet ska leverantören inte utgå ifrån."* Bilaga 3 is used for the
**shape of the information MI keeps** — the report criteria, the field
definitions, the five-step flow — never for W3D3's interface.

---

## How to check it

```
npm test          254 unit tests over lib/domain/ and lib/mock/
npm run lint      ESLint, including the architectural rules
npx tsc --noEmit  types, which is also what keeps the English translation complete
npm run build     production build; fails on a dangling mock reference
```

Two more need the app running (`npm run dev`, port 8080):

- **`npm run audit`** — the accessibility sweep and the requirement-text sweep,
  committed as `scripts/audit.mjs` and exiting non-zero on any finding. The
  first loads every route as every role with axe-core filtered to the WCAG 2.1
  A/AA tags and checks for horizontal scroll at 375–1920; the second loads every
  route with `miis_reqtags=off` and scans `main` plus the AI drawer for `§`,
  requirement IDs and appendix names. Both report **0** as of 2026-08-22.
  `-- --a11y` and `-- --copy` run one half.
- `npm run screenshots` and `npm run screenshots -- --lang=en` — 64 each, and
  see the note above about where they live.

---

## What is left, and who owns it

**Not ours, and blocking:**

1. **Bilaga 4 (Prisformulär)** is still missing from this repository. §3.1 (named
   consultants with CVs), §2.6 (the temporary-environment estimate) and §5 (fixed
   price for Steg 1, hourly rates for Steg 2, the Steg 3 option) all write into
   it. `docs/19` marks both placeholders.
2. **The Swedish rendering** of `docs/18` and `docs/19`.
3. **The 15-minute presentation.** §3.6: *"Leverantören får ej tillföra nya
   åtaganden"* — nothing may be added on the day, so it has to run off the
   written response. `/genomgang` is built to be that script.

**Ours, and deferred deliberately:**

- The remaining Bilaga 3 §3.3 fields — *Timlönefaktor*, *Arbetstidskonto/-bank*,
  *Semester*, *Föräldraledighetstillägg*, *Pensionsavtal deltid* — belong to
  Allmänna villkor and Pensionsavtal, which are sections of their own.
- The registration flow does not capture the agreement-record fields (scope
  figures, Basfakta flags). They are properties of the record rather than of the
  protocol being read, and five more boxes in US-01's five-step flow would work
  against the scenario the criterion is marked on.
- Integration tests, the UAT environment, migration verification and production
  verification are delivery work. `docs/16` says so per requirement.

---

## Things worth knowing that cost time to find

- **CRLF line endings** are in most files. Scripted string replacement fails
  silently against them; always assert the match and verify afterwards.
- **Chrome's UA stylesheet declares `[hidden] { display: none !important }`**, so
  author CSS cannot override it. `SectionTabs` hides inactive panels with a class
  for exactly this reason — the print rule has to bring every section back.
- **A server component cannot pass a function to a client component.** This bit
  once, on `DocumentTemplate`'s filename; the fix was to make it data.
- **`decimal()` does not group thousands and `amount()` does.** Two reports
  printed `52510` before this was noticed.
- **The React compiler's lint rules** reject manual `useMemo` that it can do
  itself, `setState` in an effect, and inline mutation of `document.cookie`
  inside a component body.
- **`npm run dev` must be running** for the screenshot and audit scripts; they
  hit `http://localhost:8080`.
