# MIIS — bid mockup (Medlingsinstitutet)

Interactive UX/UI prototype for a **public procurement bid**. It is not production
software. It exists to win the award criterion *"Role-based user scenarios and user
interface"* — worth **SEK 1,000,000** of a **SEK 2,500,000** total added value, i.e. 40%
of everything that can be scored. Tender deadline **2026-08-25**; 15-minute oral
presentation at MI in week 35.

Read `docs/00-START-HERE.md` before doing design work.

**Five source documents in `docs/requirements/`, each with a searchable `.txt` beside
the authoritative original. Check work against all of them, not just the first.**

**MI's own, in Swedish — these outrank ours:**

| | |
|---|---|
| `tender/Bilaga_1_Kravspecifikation.pdf` | **This is "Appendix 1"** — MI's real requirement specification, 50 pages, diarienummer 2026/0059. §3.1 roles, §4.3 system sketch, §4.4 the registration flow, §5 the requirement tables. **§4.3 and §4.4 are diagrams and are absent from the `.txt` — open the PDF** |
| `tender/Avropsforfragan.pdf` | The call-off request. §16 is how the response is scored: our criterion is worth **SEK 1 000 000 of 2 500 000**, awarded in five bands (100/75/50/25/0 %), judged on *relevans, tydlighet, konkretionsgrad, genomförbarhet* and understanding of MI's needs |

**Ours, written from MI's — useful, but second-hand:**

| | |
|---|---|
| `requirements-v2.5-EN.txt` | The Epics and Features (FA-*, FR-*, NFÅ-* …), the 20 US scenarios in chapter 8, and our UI sketches in chapter 9 |
| `bargaining-process-EN.txt` | How the Swedish bargaining round actually works, phase by phase, and which MIIS menu and scenarios serve each phase (chapter 5) |
| `information-model-EN.txt` | The 34-entity logical model and the SQL Server schema it becomes — the shape `lib/domain/` is meant to converge on |

`docs/13-tender-pack.md` records what MI's originals settle — the nav, the five steps and
the eight roles all check out — and what has **not** been diffed yet (chapter 5's
requirement tables). `docs/12-source-documents.md` records the same for the two English
guides, plus the places our domain model still diverges from the information model.

**When our English rendering and MI's Swedish original disagree, MI's original wins.**

## Hard rules

1. **Swedish is the default UI language.** Every screenshot and the live demo open in
   Swedish. English is a complete second translation reachable from the demo bar — it
   exists so the internal team and non-Swedish reviewers can read the mockup, and is not
   a product feature. No user-facing string is hard-coded in a component; all text comes
   from `lib/i18n/sv.ts` and `lib/i18n/en.ts`. Identifiers stay English; route paths stay
   Swedish.
2. **No hard-coded colours.** Use the tokens in `app/globals.css` (`bg-primary`,
   `text-muted-foreground`, `var(--mi-sand-500)`, …). The palette is derived from
   Medlingsinstitutet's identity — see `docs/design-system/`.
   **`--status-green/red/blue` belong to FR-012 and to nothing else.** In MIIS red is a
   neutral fact ("tecknat efter medling"), not a complaint; if it also meant "error" an
   agreement table would be unreadable. System feedback is a `<Callout>` — a left rule,
   an icon and a label word — never a coloured sentence. There are **no trend colours**:
   MI mediates between the parties and does not shade a settlement good or bad.
   Never soften text with an opacity modifier; that is how contrast failures get in.
   **AI is violet, and it is the one deliberate step outside the MI palette.** An AI
   proposal is machine-generated and unverified; *Märket* and a sekretessmarkering are
   MI's own information. They must not share a hue. Sand already carries Märket,
   attention, requirement tags, the public view and watchword hits — do not add a sixth
   meaning to it.
   **Everything AI produces lives inside an `<AiRegion>`, and nothing else does.** A
   banded header, the `AI` letter-mark, a 6px spine and the violet — four signals,
   because any one of them can be lost to greyscale, a projector or a colour-blind
   reader, and FAI-002 is a guarantee the officer has to be able to see. The violet
   frames the compartment; it never tints the content inside it, which is MI's own
   information being read. `Badge tone="ai"` is the **only filled badge in the system** —
   every other tone is a dark word on a pale tint, so the inverted silhouette is what
   makes AI findable before it is read. Do not fill another badge.
   The mark is **sparkles plus the letters `AI`, never one without the other** —
   a sparkle alone reads as "magic" in consumer software, and what this has to say
   is "machine-generated, not yet approved". The gradient (`ai-band`) belongs on
   the `AiRegion` header and nowhere else: a gradient has no single contrast
   ratio, so text may only sit on one whose lightest stop still clears 4.5:1.
3. **WCAG 2.1 AA is a requirement (NFUI-003), not a nice-to-have.** Every interactive
   element needs a visible focus state, a ≥44×44px hit area, a real `<label>`, correct
   heading order and a text alternative. Colour is never the only carrier of meaning —
   the green/red/blue agreement status coding (FR-012) must always have a text label too.
   **`StatusDot` is for FR-012 and nothing else; `Badge` is for every other
   state word.** FR-012 is the only status whose colours MI specified, so it gets
   the reserved hues and a mark-plus-label form — a filled red pill would read as
   an error. A row carries one status, of its own kind: a mediation case is not an
   agreement and has no FR-012 colour.
   **That label goes on the row, not in a legend under the table.** `StatusDot` carries
   colour, shape and label together, so a legend would repeat what every row already
   says; the only place `StatusLegend` still earns its keep is `/registrera`, where a
   single status is shown and the other two need explaining.
4. **No emoji, and no glyph used as an icon.** Every icon comes from
   `components/miis/icons.tsx`, which wraps `lucide-react` — already a dependency
   via shadcn. A padlock typed as `🔒` is a colour emoji on one machine and a flat
   outline on another, `✦` has no emoji form at all, and a screen reader may read
   any of them aloud by their Unicode name; none of that is reachable from our
   stylesheet, and the padlock on a sekretessmarkering is carrying a legal status.
   **An icon never stands alone** — it is `aria-hidden`, and the label beside it
   carries the meaning.
   **`Field` displays, `TextField` registers, `Button` acts, and the three do not
   look alike.** A read-only value is text on a rule; anything boxed can be typed
   into or pressed. `Field`, `TextField` and `Select` share `FieldLabel` so a
   select never sits 8px below the field beside it.
5. **Every view carries its requirement IDs.** Use the `<ReqTag id="FA-007" />`
   component. The evaluators trace requirement → interface; that traceability is a
   large part of why this mockup scores. The tags render **behind a toggle that is off
   by default** (`miis_reqtags`), so the plain product view exists too — every new ID
   also needs its sentence in `lib/domain/requirements.ts`, which is what the hover
   tooltip reads.
6. **AI proposals are never applied automatically (FAI-002).** Anything AI-suggested is
   labelled `AI-FÖRSLAG` and needs an explicit human approve/reject control. Every
   proposal is **source-linked**: selecting it highlights the passage in the protocol it
   was read from (FAI-001, FAI-004). Show the rejected path too — a demo of only the
   happy path asserts human review instead of demonstrating it.
   AI belongs where a requirement puts it. There is no general assistant: the only
   free-standing AI surface is the §4.1 decision-support panel on a mediation case.
7. **Do not touch the logo.** The MI mark contains a protected Swedish state emblem —
   a royal crown over the shield. **MI supplied the official asset on 2026-08-18**, so
   the `MI` placeholder square is gone; `public/mi-mark-white.svg` is MI's own file with
   its paths untouched. Never generate, redraw, recolour or "improve" it, and never
   substitute a lookalike. The only edit ever made was cropping the `viewBox` from the
   square export to the artwork's own bounds (`56.7 29.5 284.8 511.5`, measured with
   `getBBox()`), because the emblem is portrait and the square canvas was padding.
   White on the dark header is MI's intended treatment — every path in the source is
   `#FFFFFF`. `public/icon.svg` is the same artwork as the tab icon, with a fill rule so
   it survives a dark browser theme; `public/favicon.ico` is MI's file verbatim.
8. **Never rewrite pushed git history** (no force-push, rebase, amend or squash of
   pushed commits). Others review from this history and from deployed builds of it.

## Stack

Next.js 16 App Router (React 19, Turbopack) · TypeScript · Tailwind v4 · shadcn/ui.
`npm run dev` → http://localhost:8080.

`npm test` runs the domain suite; `docs/16-verification.md` maps it to MI's chapter 9 and
is the evidence for the response's *Arbetsprocesser och metoder* section. A rule in
`lib/domain/` gets a test — that layer imports nothing, so there is no excuse.

```
app/(miis)/**/page.tsx      the screens ← you work here
components/miis/            product components ← and here
components/ui/              vendored shadcn — restyle via tokens, don't edit
app/globals.css             all design tokens — change design here first
lib/domain/                 types + pure rules (agreement, mediation, party,
                            benchmark, event, role, status, dashboard, dataset,
                            lang, requirements)
lib/i18n/                   ALL interface copy — sv.ts is the source, en.ts must match
lib/data/                   THE SEAM — every data read goes through here
lib/mock/                   the Swedish sample data, in three demo datasets
lib/session.ts              the request's role, dataset, language and req-tag setting
```

### Where a string lives

`lib/i18n/sv.ts` holds **interface copy** — headings, labels, buttons, empty states,
helper text — keyed by screen. `en.ts` is typed `Dictionary = typeof sv`, so a missing
or misspelt key **fails `npm run build`**; that is what keeps the English complete.

**Domain vocabulary** stays in `lib/domain/` but is keyed by language:
`STATUS_LABEL[lang][code]`, `roleInfo(role, lang)`, `AGREEMENT_CONSTRUCTIONS[lang]`.
Free-text sample content in `lib/mock/` uses `Text = Record<Lang, string>` and is read
with `t(text, lang)`.

Terms with no English equivalent are **not translated**. *Märket* stays *Märket*; in
English it is rendered "Märket (industry benchmark)" on first use per screen, via
`i18n.common.benchmarkTerm`. Dates are `YYYY-MM-DD` in both languages; numbers use a
decimal comma in Swedish and a decimal point in English — `decimal(n, lang)` in
`lib/format.ts`.

**Identifiers are English, content is Swedish.** Types, functions, files, props and
variables use English names (`Agreement`, `listMediationCases`, `roleInfo`). Everything
a user reads is Swedish — labels, headings, button text, empty states, sample data.
Where a Swedish domain term has no clean English equivalent, keep the concept English
and the label Swedish: `Benchmark` / `"Märket"`.

Route paths stay Swedish (`/registrera`, `/medling`, `/sok`) — they are user-facing URLs
in a Swedish authority's system.

### Four structural rules

1. **`lib/domain/` imports nothing.** Types and pure functions only — no React, no
   Next, no data access. It is the part that survives a change of framework or backend.
2. **`lib/data/` is the only place that may touch a database.** Today it reads
   `lib/mock/`; in week 2 it reads Supabase. Nothing else imports either — enforced by
   `no-restricted-imports` in `eslint.config.mjs`, so a violation fails `npm run lint`.
3. **Pages are server components that `await` a `lib/data/` function.** Never fetch
   inside a component. This is what makes the mock→Supabase swap invisible to screens.
4. **Anything interactive is `"use client"` under `components/miis/`,** fed by props.
   `components/miis/primitives.tsx` stays server-side — no hooks in it.

Key files: `AppShell.tsx` (shell + role-filtered nav, client) · `primitives.tsx`
(`Panel`, `Field`, `Button`, `Badge`, `Callout`, `Chip`, `PageHeading`, `ReqTag`,
`Rationale`, `StatusDot`, `ConfidentialityMarker`) · `DataTable.tsx` (sticky header,
sort, overflow guard) · `DemoBar.tsx` (the reviewer controls, above the product chrome)
· `SessionTimeoutWarning.tsx` (NFÅ-002) · `icons.tsx` (the lucide set — rule 4).

**A screen does not build its own button or table.** `no-restricted-syntax` in
`eslint.config.mjs` fails the build on a raw `<button>` or `<table>` under `app/`,
because the system only holds if it is cheaper to use than to bypass — it previously was
not. `DataTable` takes server-rendered cells plus plain sort values, so ordering happens
in the browser while rendering stays on the server.

**Casing is presentation, not content.** Write `Ofullständig` in `lib/i18n/`, never
`OFULLSTÄNDIG` — `Badge` applies MI's own small-label treatment
(`.mi-kicker`: uppercase, `0.12em` tracking, 13px, bold). Capitals typed into the
dictionary are how the chips drifted out of step in the first place, and they hand a
screen reader a shouted string it may try to spell out. The exceptions are acronyms
(`MIIS`, `OCR`), the scanned protocol's own wording, and the `OCH`/`ELLER` operators,
which render in buttons rather than badges.

**Two kinds of prose.** A sentence the user needs to do the task correctly is a plain
paragraph. A sentence that justifies the design or restates a requirement is
`<Rationale>`, which rides the `miis_reqtags` switch and is absent from the product
view. If you cannot decide which one it is, it is a `Rationale`.

**The demo bar is not part of MIIS.** Role, dataset, language and requirement-ID
switches are reviewer tools. They live in a visually distinct strip *above* the header,
labelled as demo settings, so an evaluator cannot mistake them for proposed
functionality. Never move one into the product chrome.

`StatusDot` takes a whole `StatusInfo` (`{kod, farg, etikett}`) rather than a colour, so
FR-012 status can never be rendered as colour alone. Get one from `statusInfo()` or
`avtalStatus()` in `lib/domain/status.ts`.

## Working agreement

- **Prototype data lives in `lib/mock/`, never inside a page.** In Swedish, and
  **realistic**: real Swedish party names (Teknikföretagen, IF Metall, Almega, Unionen,
  Kommunal, Sveriges Lärare, Fremia), plausible agreement names, dates in the
  2026–2027 bargaining round. Fake-looking data reads as an unfinished prototype.
- **Add a record in one place only.** Table rows are derived from the records — there is
  no second list to keep in step. Add an `Agreement` to `lib/mock/agreements.ts` and it
  appears everywhere it belongs.
- Relations are id strings (`MediationCase.agreementIds` → `Agreement.id`) with no
  database enforcing them, so `lib/mock/integrity.ts` checks them at module load and
  **fails `npm run build`** on a dangling reference.
- Three demo datasets — `quiet`, `normal`, `peak` — switchable from the header. Sample
  data added to `lib/mock/agreements.ts` lands in `normal` and `peak`; `quiet` is
  deliberately near-empty so empty states can be designed.
- A page that needs data adds a function to `lib/data/`; it does not reach into
  `lib/mock/` itself. Lint enforces this.
- Prefer editing an existing view over adding a new route. The nav mirrors **MI's own
  functional modules** (Appendix 1 §4.3, quoted in spec §5.1) — not the requirement
  Epics — and each role sees only its own items (`RoleInfo.nav`). Registration is an
  action, not a place: `/registrera` is reached from a primary button, never the menu.
- After a UI change, verify it in the browser (`/flow-test`), don't just assume.
- Keep the branch working — the Vercel deployment builds from it and the CEO reviews
  there.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
