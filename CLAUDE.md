# MIIS — bid mockup (Medlingsinstitutet)

Interactive UX/UI prototype for a **public procurement bid**. It is not production
software. It exists to win the award criterion *"Role-based user scenarios and user
interface"* — worth **SEK 1,000,000** of a **SEK 2,500,000** total added value, i.e. 40%
of everything that can be scored. Tender deadline **2026-08-25**; 15-minute oral
presentation at MI in week 35.

Read `docs/00-START-HERE.md` before doing design work.

**Seven source documents in `docs/requirements/`, each with a searchable `.txt` beside
the authoritative original. Check work against all of them, not just the first.**

**MI's own, in Swedish — these outrank ours:**

| | |
|---|---|
| `tender/Bilaga_1_Kravspecifikation.pdf` | **This is "Appendix 1"** — MI's real requirement specification, 50 pages, diarienummer 2026/0059. §3.1 roles, §4.3 system sketch, §4.4 the registration flow, §5 the requirement tables. **§4.3 and §4.4 are diagrams and are absent from the `.txt` — open the PDF** |
| `tender/Avropsforfragan.pdf` | The call-off request. §16 is how the response is scored: our criterion is worth **SEK 1 000 000 of 2 500 000**, awarded in five bands (100/75/50/25/0 %), judged on *relevans, tydlighet, konkretionsgrad, genomförbarhet* and understanding of MI's needs. §18 lists the appendices — **Bilaga 2 and 4 are still not in this repo**, and Bilaga 2 is where the scored criterion's own instruction appears to live |
| `tender/Bilaga_2_Leverantorskontroll.pdf` | **The scored criterion's own instruction lives here — §3.5.** Arrived 2026-08-21 and supersedes the English paraphrase everything was built against. It names the three roles, the four elements per role, **thirteen prescribed bullets** across the three scenarios, and the six things MI says it will judge. Also §3.4 arbetsprocesser (a ska-krav of its own), §3.6 the 15-minute presentation (*"leverantören får ej tillföra nya åtaganden"*), §3.2 Steg 1 before 2027-04-01, §3.7 MI owns source and documentation outright. **Bilaga 4 is still missing** |
| `tender/Bilaga_3_W3D3_Anvandarmanual.pdf` | **The current system's user manual** (W3D3 Avtal, v1.9, 2025-10-31). Every registration form field by field, the two published interfaces (Allmänheten, Medlare), the search-builder objects and **seven** reports — one more than Bilaga F. §18.3 states its limit in MI's own words: *"Det gamla systemet ska leverantören inte utgå ifrån vid utvecklingen av det nya systemet."* **Migration source and process background, never a design template** |

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

**`docs/17-scenario-criterion.md` is the one to read before planning work.** Bilaga 2 §3.5
names **three** roles — Systemadministratör, Avtalsadministratör/Handläggare, Allmänhetens
dator — and asks for four things about each: uppgift och mål, arbetsflöde, visualiseringar,
and a användbarhet/effektivitet/tillgänglighet statement. The prototype implements all
eight roles, which is right, but the *presentation* is marked on those three. **§3.5 also
prescribes thirteen bullets**, and they are not our US-* scenarios — that doc holds the
bullet-by-bullet diff against the running build.

**§3.5 and Bilaga 1 §3.1 contradict each other about who administers users**, and the
contradiction is explicit: §3.1 gives Systemadministratör *"full åtkomst … (exkl.
behörigheter)"* while §3.5's Scenario 1 asks that role to create users and assign roles.
Never resolve it by widening `system-admin` — that breaks §3.1 and NFÅ-005. Demonstrate
every bullet and **switch role where §3.1 requires it, saying why on screen**: separation
of duties is the reason MI wrote the parenthesis, and naming it is evidence for
*"leverantörens förståelse för verksamhetens krav"*, one of the six scored judgements. **`docs/18-role-scenarios.md` is the response text** for all four elements of
all three, drafted against what the prototype actually does — and it carries no
*to be strengthened* caveats any more. **The demo itself leads with those three:
`/genomgang`** is the reviewer's guided walkthrough and the address to send an evaluator
to. Its content is `lib/domain/walkthrough.ts`, and a test asserts that no step sends a
reviewer to a screen its own role would be refused.

**When our English rendering and MI's Swedish original disagree, MI's original wins.**

## Hard rules

1. **Swedish is the default UI language.** Every screenshot and the live demo open in
   Swedish. English is a complete second translation reachable from the demo bar — it
   exists so the internal team and non-Swedish reviewers can read the mockup, and is not
   a product feature. No user-facing string is hard-coded in a component; all text comes
   from `lib/i18n/sv.ts` and `lib/i18n/en.ts`. Identifiers stay English; route paths stay
   Swedish.
2. **The typeface is Public Sans, self-hosted from `app/fonts/`.** NFA-001 forbids
   dependencies on external cloud services and names Google Cloud, so no CDN and
   not `next/font/google` either — the two `.woff2` files are in the repository
   and nothing leaves MI's environment at build or run. It is drawn for
   government forms, its figures are tabular by default (measured: `2027-04-01`
   and `1111-11-11` both 121.69px) and it separates 1/l/I where Arial does not.
   Arial stays as the fallback because MI's own brand font is still unverified.

3. **No hard-coded colours.** Use the tokens in `app/globals.css` (`bg-primary`,
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
4. **WCAG 2.1 AA is a requirement (NFUI-003), not a nice-to-have.** Every interactive
   element needs a visible focus state, a ≥44×44px hit area, a real `<label>`, correct
   heading order and a text alternative. Colour is never the only carrier of meaning —
   the green/red/blue agreement status coding (FR-012) must always have a text label too.
   **Authorisation is read *or* write, per screen (NFÅ-003).** Appendix 1 §3.1
   gives each role a verb, and they differ — the statistics user has "read, data
   extract", the public computer "specific reports". `accessLevel(role, screen)`
   in `lib/domain/role.ts` is the one answer; the menu, the screen guard and the
   matrix on `/administration/anvandare` all ask it, so they cannot disagree.
   **Progress and selection are two facts, and `Stepper` keeps them apart.**
   `states` is how far the process has got; `selected` is which step is being
   looked at. Collapsing them — `p === phase ? "current" : …` — made a completed
   step lose its tick the moment the officer clicked back to it, so the screen
   said the work had come undone.
   **A table's `minWidth` is what its own headers need, and the column it sits
   in has to be that wide.** `DataTable` scrolls inside its region rather than
   widening the page, which makes an over-wide table invisible in an audit and
   permanently behind a scrollbar in use. The agreement view's sidebar was
   `0.85fr` — 46 % of the page for one value per row — while the six-column
   wage table scrolled in what was left. A sidebar of short facts is a fixed
   width; the content column takes the rest. **And a date never breaks inside
   itself**: nowrap each value and let the wrap fall on the separator, because
   `2027-04-` over `01 · 3,2 %` is not a date anyone can read.
   **Publication is an act, not a property.** `isPublished` gates the public
   interface, and `mayPublish` refuses a registration that is not complete and
   signed — MI decides when an agreement is released, and a half-registered
   record on the public computer would be the authority publishing a draft.
   `reportSelection.website` is adjacent and is not the same thing: it is which
   *reports* the agreement is drawn into once it is out.
   **A report a role may run has to produce something that role may read.**
   *Avtal – Medlare* pointed at `/avtal`, and §3.1 gives Medlare Start and
   Rapporter — so the picker offered a report whose only outcome was the
   authorisation notice. `ReportResult.kind` is `"screen"` only when the
   audience has that screen.
   **`StatusDot` is for FR-012 and nothing else; `Badge` is for every other
   state word.** FR-012 is the only status whose colours MI specified, so it gets
   the reserved hues and a mark-plus-label form — a filled red pill would read as
   an error. A row carries one status, of its own kind: a mediation case is not an
   agreement and has no FR-012 colour.
   **That label goes on the row, not in a legend under the table.** `StatusDot` carries
   colour, shape and label together, so a legend would repeat what every row already
   says; the only place `StatusLegend` still earns its keep is `/registrera`, where a
   single status is shown and the other two need explaining.
5. **No emoji, and no glyph used as an icon.** Every icon comes from
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
   **A field's width says what goes in it.** `TextField` takes
   `width="short|medium|full"` — a date or a percentage is short, a name is
   medium, free text is full. A box stretched to the column tells the reader
   nothing and makes them track from label to caret across 700px for a
   thirty-character name.
   **A form row is a `FormGrid`, never a hand-written `grid-cols-N`.** Its
   columns come from the *field* (`--form-col`, 12rem) rather than from a
   fraction of the panel, so width becomes a span — short is one column, medium
   two, free text the row. Writing the grid by hand produced all three faults
   reported together: ragged rows (five fields in a three-column grid is 3 then
   2), two different gaps in one panel (two fields across a two-column grid sit
   300px apart, three across a three-column grid sit 24px apart), and boxes that
   do not line up down the form. A hint does **not** widen a field; a hint that
   will not fit under a date is a `Rationale` wearing a hint's clothes.
   **The unit goes in the label, the value stays a bare number** — `Löneutrymme
   (%)` with `3,4`, never a field reading `3,4 %`. A user typing into a box that
   already carries the sign has to decide whether to keep it, and `"3,4 %"` is a
   string no report can sum. **One fact per field**: `Ja · 0,2 %` was two.
   **`Button` and `LinkButton` share one size scale and one shape.** A control
   that navigates is a `LinkButton` (an `<a>`, so it opens in a new tab and
   shows its destination); one that acts is a `Button`. Seven screens hand-rolled
   the first and the classes drifted — `rounded-sm` against `rounded-md`,
   `min-h-11` against `min-h-12`.
   **Icons on a control follow one rule**: `iconStart` for an action that
   *creates* (`IconPlus`), `iconEnd` for one that *goes somewhere*
   (`IconForward`), and nothing otherwise. Never type a `+` into the copy —
   ten labels carried one, in two languages, out of step.
   **A control that does nothing is `disabled` with a `disabledReason`.** Never
   leave a `<Button>` without `onClick`, and never style a `<span>` as a link —
   a control that looks live and is not teaches an evaluator that the whole
   prototype is a picture. Disabled is a **dashed** border, because a solid
   outline in a paler colour is still an outlined button and leaves the page's
   real priority unreadable.
   **Three "pick one" controls, kept apart on purpose.** `Toggle` is a `switch`
   (a flag on or off). `Tabs` is a `tablist` (which panel is shown).
   `SegmentedControl` is a `radiogroup` (a value that is part of the data, like
   the OCH/ELLER operator). Do not build a fourth by hand.
   **A selected chip is filled, an unselected one is an outline on card.** The
   two states used to be two pale tints measuring 1.01:1 against each other, and
   `tone` read `selected` while the toggle variant set `pressed` — so a pressed
   chip changed nothing but its glyph.
   **A filter chip is an outline, and every register draws it with `FilterChips`.**
   A filled chip is `Chip`'s *selected* state — one of a set of options, chosen.
   A filter chip is not one of a set: it is a criterion already applied, and the
   only thing it offers is removal, so filling it puts the loudest treatment in
   the system on the control the reader is least likely to press. The two
   registers had built this twice and disagreed on all of it — filled vs outline,
   count vs no count, "Rensa filter" vs "Rensa alla".
   **A filter filters.** The controls own the register's `DataTable` and narrow
   it through `Row.facets`; a filter that changes the chips and leaves the rows
   in place is a control that looks live and is not, which is the same failure as
   a `<Button>` with no `onClick`. An empty result is a sentence, never an empty
   table with a header on it.
   **Sand is Märket's colour, but a filled sand block is an alert's *shape*.**
   The start page's Märket banner is a card with a sand spine and a kicker, not
   a tinted box with a border — sand also carries `Ofullständig` and watchword
   hits, so the form has to say "reference" where the hue cannot.

   **The start page shows three rows per panel and says how many there are.**
   `START_PAGE_ROWS` in `lib/domain/dashboard.ts` is the one number; panels were
   showing three, three, four and five, which gave the eye no rhythm. The page is
   for noticing that something is waiting, not for working through it — a panel
   with more than it shows renders "Visar 3 av 12" and the register owns the rest.
   One primary quick action per role and at most two more, taken from that role's
   own US scenarios rather than from the menu.
   **There is no sign-in screen, and there should not be.** NFÅ-001 puts
   authentication in Försäkringskassan's IdP over SAML, so drawing a login page
   would claim we built the one thing we certainly did not. Signing *out* is
   different — NFL-001 logs it — so the header carries it.
   **A setting is editable only where a requirement lets it be.** `SYSTEM_SETTINGS`
   in `lib/domain/settings.ts` carries four, and two are deliberately fixed with
   the sentence that fixes them on the row: NFL-003 names *systemadministratörer*
   in its prohibition, and NFÅ-006's IP restriction lives in Försäkringskassan's
   operating environment. Showing the fixed ones beside the editable ones is what
   says the requirement was read; four editable boxes would say we built a form.
   NFÅ-002's limit is configurable **end to end** — written on Administration,
   read by `getSession`, applied by `SessionTimeoutWarning`, stated on the start
   page — because a setting that does not reach the behaviour is a setting that
   only looks like one. Its bound is a **ceiling**: MI may shorten the limit, and
   raising it past thirty minutes would weaken NFÅ-002 rather than configure it.
   **Users and role assignment are editable; the permission matrix is not.**
   NFÅ-005 names exactly what MI administers without us — *"upplägg och
   redigering av användare och rolltilldelning"* — so `/administration/anvandare`
   has a user register with an add form, and the role × module matrix under it
   stays read-only: NFÅ-003 defines access by the eight roles §3.1 writes down,
   and a matrix an administrator could rearrange would describe a configuration
   rather than MI's own document. A user is a *link* to an identity in
   Försäkringskassan's IdP, so there is no password field and no account
   creation. Users are deactivated, never deleted — NFL-001 logged their
   sign-ins — and `mayDeactivate` refuses to let the last authorisation
   administrator lock MI out, which is the one lock-out only the supplier could
   repair.

   **A report is a selection screen and a result, never a button.** Bilaga F
   opens by saying so — *"För varje rapport visas urvalsbild och resultat"* — and
   MI's own criteria differ per report: three for the single-agreement ones, nine
   for the two population reports, three blocks for the pension report. The
   catalogue is `REPORTS` in `lib/domain/report.ts`, read off MI's own W3D3
   screens; `ReportRunner` draws it. The chosen criteria are printed as an
   *Urvalskriterier* block at the head of the result, every criterion named and
   the empty ones reading "Alla" — a reader has to be able to see that Sektor was
   *not* narrowed. And **the criteria narrow the data**, except where the figures
   are MI's own published population (Avtalskonstruktioner), where the screen
   says so instead of pretending.
   **A document template shows what it pre-filled.** FSD-001 and FSD-002 ask for
   documents *"utifrån en dokumentmall, där förinmatad information från MIIS ska
   kunna redigeras"* — both halves. `DocumentTemplate` lists each pre-filled
   value with the register it came from, opens the body for editing, and names
   the file it will produce. A disabled button with "skapas utifrån mall" beside
   it states the requirement and demonstrates none of it. FSD-001's two variants
   are a `SegmentedControl`, because *med varsel* and *utan varsel* are one
   document with a property, not two documents.
   **A screen prints as a document, not as a screenshot.** `PrintHeader` gives it
   MI's mark and an *Utskriftsdatum* the way Bilaga F's six printouts do; the
   `@media print` block in `globals.css` drops the demo bar, the nav, the header
   and the requirement tags. Printing is the **only** export that runs without a
   server, so it is wired while Excel, CSV and JSON stay dashed.
   **The letterhead is `AppShell`'s, not the page's**, and it carries no title —
   the page's own `<h1>` follows it and *is* the title. Sixteen screens had been
   printing with no mark and no date because a page had to remember to ask; the
   four that did ask printed their title twice.
   **A control is not part of the document.** `PageHeading` puts `print-hide` on
   its `back` and `action` slots, and the two screens whose top half is a
   *control* rather than a result — the report picker and the query builder —
   are `print-hide` in full. Bilaga F's printouts are *Urvalskriterier* plus the
   result; paper that carries a Skriv ut button is a screenshot of an
   application.
   **FR-011 and D-002 are enforced in the markup, not the stylesheet.**
   `maySeeConfidential(role)` is false for `public` and `mediator`; a value
   hidden by CSS is still in the document, and a requirement about what may
   leave the building cannot be met by not painting it.
   **Informationsbegränsning is not sekretess, and it takes both halves.**
   Bilaga 3 §3.3 restricts a *section* — MI's form carries two, arbetsgrupper
   and lägstlöner — so `isSectionLimited(agreement, section)` says **what** is
   restricted and `maySeeConfidential(role)` says **who** may read it. An
   agreement can be restricted and not marked, or marked and not restricted.
   The officer who set it sees it named on Basfakta: a restriction nobody can
   see back is one nobody can lift. And a restriction that hides nothing
   demonstrates nothing — the sample data keeps real content behind both.
   **A registered flag is a flag *and* a comment.** MI pairs them six times in
   §3.3, and `Nej` with a comment is a real state: "checked, and it is not one"
   is different from nobody having looked. `NotedFlag`, never a bare boolean.
   **A figure that can be derived is derived.** *Organisationsgrad* comes from
   fackmedlemmar and anställda rather than a third stored number, and it returns
   `undefined` rather than 0 where MI's own printouts show `¤` — a computed 0 %
   is a claim about the labour market, an absent value a claim about the record.

6. **Every view carries its requirement IDs.** Use the `<ReqTag id="FA-007" />`
   component. The evaluators trace requirement → interface; that traceability is a
   large part of why this mockup scores. The tags render **behind a toggle that is off
   by default** (`miis_reqtags`), so the plain product view exists too — every new ID
   also needs its sentence in `lib/domain/requirements.ts`, which is what the hover
   tooltip reads.
   **A queue item lands on the work it promises.** The AI drawer's queue said
   "nine proposals, interpreted but not approved" and linked to `/registrera`,
   which opens on an empty drop zone — so the one control that says work is
   waiting delivered a blank form, and looked identical to the task button
   above it that *starts* an interpretation. `?forts=1` resumes past the upload
   and the pipeline. The badge says what the number counts and the button says
   what the officer is about to do; "Öppna vyn" on a queue said neither.

7. **AI proposals are never applied automatically (FAI-002).** Anything AI-suggested is
   labelled `AI-FÖRSLAG` and needs an explicit human approve/reject control. Every
   proposal is **source-linked**: selecting it highlights the passage in the protocol it
   was read from (FAI-001, FAI-004). Show the rejected path too — a demo of only the
   happy path asserts human review instead of demonstrating it.
   AI belongs where a requirement puts it, and **`lib/domain/ai.ts` is where that
   list lives** — §4.1's four functions, no fifth. `AI_FUNCTIONS` says what each
   one does, which requirement it answers and which routes it runs on;
   `AI_BOUNDARIES` says what the AI must *not* do, in MI's own words
   (*"alla förslag … ska granskas och godkännas"*, *"Helt nya avtal … ska alltid
   registreras manuellt"*). Both are tested.
   **The AI assistant is a drawer, and it is not a chatbot.** §4.1 asks for an
   *integrerat* AI-stöd and §4.3's system sketch carries AI-assisted registration
   as a module in its own right, so the launcher is fixed to the **bottom right**
   of every screen the role may act on — not in the header, which is where a user
   goes to leave. The drawer opens on the two things an officer acts on: **what
   they can ask the AI to do here**, as controls, and **what is waiting for their
   approval** (the queue FAI-002 implies must exist). The tasks are §4.1's four
   functions applied to the current screen, which is what "ask the AI to do
   something" means in a system whose AI *is* four named functions. **On a screen
   where none of them runs, the drawer says so and offers one way to the nearest
   screen that does** — falling back to every function the role can reach showed
   three protocol tasks on Rapporter, Parter and the start page, which is why
   the assistant read as the same unplaceable panel everywhere. On a screen
   where one *does* run, the task button goes to the **region**, not to the
   route it is already on (`aiTaskHref`).
   **§4.1's third function *is* a text input, and it is now built.**
   `ClauseSearch` on `/registrera`: *"via fritextsökning i protokoll och avtal
   ska systemet kunna identifiera och föreslå registrering av specifika
   skrivningar"*. One term, one protocol, and every hit a source-linked proposal
   that becomes a *Särskild fråga* only if the officer approves it. That is the
   box to type into, and it is the answer whenever someone asks for one.
   **A free prompt box is still the mistake** — an authority procures a bounded
   set of behaviours; a box that accepts any instruction has no defined output,
   so there is nothing for FAI-002 to review. The catalogue, MI's own limits and the traceability
   sit behind one *Om AI-stödet* toggle: they are the sections a competitor will
   not have, and they are still reference material, which does not belong above
   the work. NFÅ-003 applies inside it — the queue is filtered by **write**
   access, so an officer sees only work they can actually clear, and a role with
   no AI screen gets no launcher.
8. **Do not touch the logo.** The MI mark contains a protected Swedish state emblem —
   a royal crown over the shield. **MI supplied the official asset on 2026-08-18**, so
   the `MI` placeholder square is gone; `public/mi-mark-white.svg` is MI's own file with
   its paths untouched. Never generate, redraw, recolour or "improve" it, and never
   substitute a lookalike. The only edit ever made was cropping the `viewBox` from the
   square export to the artwork's own bounds (`56.7 29.5 284.8 511.5`, measured with
   `getBBox()`), because the emblem is portrait and the square canvas was padding.
   White on the dark header is MI's intended treatment — every path in the source is
   `#FFFFFF`. `public/icon.svg` is the same artwork as the tab icon, with a fill rule so
   it survives a dark browser theme; `public/favicon.ico` is MI's file verbatim.
9. **Never rewrite pushed git history** (no force-push, rebase, amend or squash of
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
· `SessionTimeoutWarning.tsx` (NFÅ-002) · `icons.tsx` (the lucide set — rule 4) · `Select.tsx` (`Select`, `SegmentedControl`, `Tabs`).

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
functionality. Never move one into the product chrome. **`/genomgang` follows the same
rule** — outside the `(miis)` route group, no shell, no menu entry, the demo strip's own
colour, and it says what it is in its first sentence. A "walkthrough module" inside the
product would work against the criterion it exists to serve.

**The walkthrough is walked from inside the product, and the demo strip is how.**
`WALKTHROUGH_COOKIE` records which scenario and step the reviewer opened; the strip then
carries *Nästa: <step>* on every screen, switching the role the same way the guide's own
buttons do. Before that, the guide was a page you **left**: opening step 2 took you to a
screen and the only route to step 3 was back to a 5 267px document to find your place —
impossible in front of an evaluator with fifteen minutes. The onward control belongs in
the strip and nowhere else; putting it in the product chrome is the "walkthrough module"
the rule above forbids. `/genomgang` itself shows **one scenario at a time** under a
contents list of all seven, and a step button names the step rather than the role —
sixteen buttons reading *"Öppna som Avtalsadministratör"* said nothing about where you
were about to land. The role is named only when it is about to **change**, which is the
one case it is a warning rather than noise.

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
