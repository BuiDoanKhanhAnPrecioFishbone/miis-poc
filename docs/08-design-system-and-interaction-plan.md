# Design system and interaction plan

Written 2026-08-17, after the UX-review update plan landed. Read alongside
`CLAUDE.md`, `docs/03-screen-backlog.md` and `docs/design-system/`.

**Design freeze 2026-08-21.** Four working days. This plan is ordered so that the cut
line can fall anywhere and what is left above it is still coherent.

---

## 0. Three decisions, up front

These are the answers to the three questions this plan exists to settle. The reasoning
matters more than the conclusions, because two of them are specific to MIIS rather than
general design taste.

### 0.1 Do we restyle the primitives? — **No. We consolidate them.**

The tokens, the palette and the look are not the problem; the update plan was right that
they are already correct and should not be rebuilt. The problem is **drift**: the
`Button` primitive is used 13 times and hand-rolled 27 times, badges exist as 10 copies
of the same class string, and seven tables repeat the same `<thead>` markup.

A design system that is bypassed twice as often as it is used is not a design system. It
is also a concrete risk in this bid: `NFU-002`/`NFU-004` promise that another supplier
can take over the code, and duplicated Tailwind strings are exactly what makes that
claim ring hollow to a technical evaluator reading the handed-over source.

So: extract the missing primitives, consolidate the existing ones, and change nothing
about how any of it looks. See §1.

### 0.2 Do we add success / error / up / down colours? — **No. Two deliberate refusals.**

**Refusal 1: no trend colours on numbers.** Medlingsinstitutet is a neutral state
authority mediating between employers and unions. Colouring a 3,2 % wage outcome green
because it is high, or red because it is low, states a position the authority does not
have. There is no requirement asking for it, and a bid partly scored on *demonstrated
understanding of the assignment's conditions* should not editorialise the parties'
settlements. Percentages stay `text-foreground`.

**Refusal 2: no general success/error palette reusing the FR-012 hues.** In MIIS, red is
**not** bad. `--status-red` means "tecknat efter medling" — a neutral fact about how an
agreement came about. If red also means "error" and green also means "success", then a
red row in the start-page table becomes unreadable: the user cannot tell a domain fact
from a system complaint. That is a real defect, not a stylistic preference, and it is
the kind of thing an accessibility or UX evaluator notices immediately.

**What we do instead.** Feedback gets its own channel, distinguished by *form* rather
than by hue:

| Meaning | Carrier | Token |
|---|---|---|
| FR-012 agreement status | colour **+ shape + text label** | `--status-green` / `--status-red` / `--status-blue` — reserved, used nowhere else |
| Blocking error, destructive action | `<Callout tone="error">` — left rule, icon, bold label word, then the message | `--destructive` |
| Confirmation, "this is complete" | `<Callout tone="ok">` | `--mint` / `--mint-border` |
| Attention, "this needs a decision" | `<Callout tone="attention">` | `--sand` / `--sand-border` |
| AI-generated, needs human review | existing AI chip | `--ai` / `--ai-border` |
| Reviewer annotation | requirement tag | `--req` |

Five channels, each with a shape as well as a colour, none of them borrowing the FR-012
hues. The rule to write into `CLAUDE.md`:

> The three status colours belong to FR-012 and to nothing else. System feedback is a
> `Callout`, never a coloured word or a coloured number.

### 0.3 Do we change the layout? — **Yes, in five specific places.**

Not a re-layout. Five changes, each of which removes scrolling or clicking from a task
someone does repeatedly. Ranked by time saved per use in §3.

---

## 1. Component work

### 1.1 Extract (each currently exists 3+ times as duplicated classes)

| Primitive | Replaces | Notes |
|---|---|---|
| `Badge` | 10 inline pill spans | Variants: `neutral`, `ok`, `attention`, `error`, `ai`. Never a bare colour — always a word. **Owns its casing**: MI's `.mi-kicker` treatment in CSS, sentence case in the dictionary. Extracting the component was not enough — casing stayed in the content and the chips drifted anyway. |
| `DataTable` | 7 hand-built tables | Owns `<thead>` styling, sticky header, row hover, zebra, the `overflow-x-auto` wrapper and the `min-w` guard. Column defs carry `align` and `numeric` so `tabular-nums` stops being copy-pasted. |
| `Toggle` | 3 fake switches in `/registrera` | A real `<button role="switch" aria-checked>`. Currently they are two nested `<span>`s that cannot be operated at all. |
| `Tabs` | `/sok` (4), `/rapporter` (4) | Roving tabindex, `aria-selected`, arrow-key navigation. |
| `Chip` | `/sok` selection chips, document-type pills | Removable and non-removable variants. |
| `Callout` | ~12 bordered note boxes across five screens | Tones per §0.2. |
| `Select` | 5 fake `▾` dropdowns | See §4 — these become real. |

### 1.2 Consolidate

- **`Button`** — one component, variants `primary` / `secondary` / `ghost` / `danger`,
  sizes `md` (48px, the default) and `sm` (44px, for in-row actions). Replace all 27
  hand-rolled buttons. This is mechanical and is the single highest-value cleanup.
- **`Field`** — split in two. Today every read-only value is drawn with a 2px input
  border, so the whole prototype looks editable and nothing is. Split into:
  - `Field` — display only, no input chrome, label above value. Denser, and honest.
  - `InputField` — a real focusable control, used on the screens where editing *is* the
    scenario (`/registrera`, `/sok`, `/allmanheten`).

  This matters beyond tidiness: an evaluator who clicks a field that looks like an input
  and gets nothing has learned something about the prototype we would rather they did not
  learn.

### 1.3 Enforce

Add an ESLint rule banning raw `<button>` and `<table>` outside `components/miis/` and
`components/ui/`, in the same spirit as the existing `no-restricted-imports` migration
rule. Drift that fails the build does not come back.

---

## 2. Colour system changes

Small, and all in `app/globals.css`:

1. Add `--attention` / `--attention-border` (sand family) and `--ok` / `--ok-border`
   (mint family) as *semantic* aliases, so `Callout` never names a palette colour
   directly. The palette itself does not change.
2. Document the reservation of `--status-*` in the token file, next to the tokens.
3. Leave `--destructive` as is; it is already correct and already only used for genuine
   destructive meaning.

One new hue is introduced, and only one: **violet for AI**, restored from the CEO's
US-01 sketch (`--mi-ai-100/500/800`). Folding AI into sand had left a single hue
carrying seven meanings — Märket, AI, attention, requirement tags, the public view,
watchword hits and accent — several of them on screen together in `/registrera`. That is
the same failure the FR-012 colours are protected from, and §0.2 missed it by applying
the test to red but not to sand.

Stepping outside the MI identity is the *point* here: an AI proposal is machine-generated
and awaiting approval, which is categorically different from MI's own registered facts.
Contrast verified at 8.47:1 for text and 4.78:1 for the border.

---

## 3. Layout changes, ranked by time saved

| # | Change | Screen | Why it saves time |
|---|---|---|---|
| 1 | **Sticky protocol pane** | `/registrera` | The task is read-source ↔ fill-form. Today the protocol scrolls away as soon as the case officer moves down the form, so every check is a scroll up and a scroll back. Making the left pane `position: sticky` keeps the source beside the field being filled — this is the single biggest workflow win in the app. |
| 2 | **Sticky table headers + row hover + sortable columns** | all 7 tables | A statistics user comparing 143 rows currently loses the column names after eight rows and cannot reorder. Sorting by status, by date and by registration status covers most of what FR-008 and FR-012 users actually do. |
| 3 | **Confidentiality marker as an icon + accessible label in tables** | `/rapporter`, `/sok`, `/`, `/allmanheten` | The full chip with its explanatory note triples the height of any row it appears on, which pushes the rest of the table off screen. The full marker stays on detail views, where there is room for it. |
| 4 | **Breadcrumb / back affordance** | `/medling/[id]`, and any future detail view | There is no way back to the case list except the main menu. One line in `PageHeading`. |
| 5 | **Two-pane `/sok`: criteria left, results right on wide screens** | `/sok` | The loop is change-a-criterion → look-at-results. Today results live below a tall criteria panel, so every iteration is a scroll. At ≥1280px both fit side by side. |

**Deliberately not doing:** a global header search. FR-001 would support it, but every
role reaches search from the menu already, and adding an unrequested global affordance is
the same mistake the general AI assistant was.

---

## 4. Bonus, part A — the annotation layer

**The problem.** About 18 sentences in the product view are addressed to the *evaluator*,
not the user: "Fullt stöd utan de tekniska hjälpvariabler som dagens sökbyggare kräver",
"Ofullständig registrering följs upp med påminnelse", "Röd markering = koppling till
medling". A case officer registering their fortieth protocol needs none of it. It is
tender argument sitting inside the interface, and it makes the product view look like a
brochure.

**The fix.** We already have a two-state view: `data-reqtags="on|off"` on `<html>`. Add
the prose to that same layer rather than deleting it.

```tsx
<Rationale>{t.medling.linkedNote}</Rationale>   // renders only when tags are on
```

`Rationale` hangs off the same `data-reqtags` switch, but — unlike `.req-tag` — it uses
`display: none` rather than reserved space. Reserving room for a removed *paragraph*
would leave the product view full of holes, which is the opposite of the goal. The
no-layout-shift guarantee stays where it earns its keep: the inline tags, where the two
views are meant to be compared pixel for pixel. Prose is a different case, because the
reader is reading one document or the other, not comparing them.

The result is two honest views:

- **Tags off** — the product MI is being asked to evaluate as a system. Clean.
- **Tags on** — the traceability document: requirement IDs, their sentences on hover,
  *and* the justification prose explaining why the screen is built this way.

**Triage rule for each of the 18 sentences** — three buckets, decided per sentence:

| Bucket | Test | Action |
|---|---|---|
| Operational | A user needs this to do the task correctly | Keep in the product view, but shorten |
| Explanatory | It justifies a design or restates a requirement | Move to `<Rationale>` |
| Redundant | It repeats what the UI already shows | Delete |

First pass at the triage (to be confirmed screen by screen):

- **Keep** — `t.registrera.review.blockedNote` (tells the user why they cannot proceed),
  `t.rapporter.shortTerm.incompleteWarning` (a consequence of their selection),
  `t.confidentiality.inStatistics` (a non-obvious rule with real meaning),
  `t.session.unsaved`.
- **Move to `Rationale`** — `documentTypesNote`, `pointInTimeNote`, `stage2Note`,
  `exportNote`, `linkedNote`, `mediatorStatsNote`, `templateNote`, `outcomeNote`,
  `eventLogNote`, `ocrNote`, `markExportedNote`, `savedSearchNote`, `joinExplain`.
- **Delete** — `t.decisionSupport.reviewNote` (duplicated by `scopeNote` on the same
  panel), and the dashboard footnotes that restate their own panel title.

Rough count: 18 sentences → about 4 kept, 13 moved, 1 deleted.

---

## 5. Bonus, part B — data and active states

The principle: **a control that cannot be operated is worse than no control.** An
evaluator who clicks a dropdown and gets nothing concludes the prototype is a picture.
Every control listed here either becomes real or is demoted to plain text.

### 5.1 Inventory of inert controls

| Screen | Control | Today | Target |
|---|---|---|---|
| `/registrera` | Avtalskonstruktion (1–7) | static `▾` | real `Select`, 7 options from `AGREEMENT_CONSTRUCTIONS` |
| `/registrera` | Registreringsstatus | static `▾` | real `Select`, Ofullständig / Klar, drives the FR-012 preview beside it |
| `/registrera` | Jämställdhetsflagga, Industrimärke, Sekretessmarkera | 3 fake switches | real `Toggle`; the confidentiality one flips the `ConfidentialityMarker` live |
| `/registrera` | Steps 1–5 | decorative | either navigable or reduced to a progress bar (recommend: navigable, they are cheap) |
| `/sok` | Field / operator / value in each condition | static `▾` ×3 per row | real `Select`s, with the value list keyed off the chosen field |
| `/sok` | Bokslutsläge | static `▾` | real `Select`, Aktiverat / Avaktiverat, which shows or hides the snapshot date |
| `/sok` | Handlingstyper | static pills | `Chip` with a real selected state |
| `/sok`, `/rapporter` | Tabs | static spans / anchors | real `Tabs` |
| `/rapporter` | Sätt påminnelse | button does nothing | opens a small date popover, writes into the row (FA-022) |
| `/allmanheten` | 4 selection controls | real `<select>` but nothing filters | wire to actual filtering |
| everywhere | Export buttons | do nothing | keep inert, but say so — a disabled state with "Ej aktiv i demon" is honest; a silent no-op is not |

### 5.2 Data needed to make them real

Everything below goes in `lib/mock/`, is reached through `lib/data/`, and is covered by
`lib/mock/integrity.ts`:

1. **Option catalogues** — `lib/domain/options.ts`: searchable fields, their operators,
   and their value domains. Pure, no I/O; this is what makes the query builder's
   field→operator→value chain real rather than three unrelated dropdowns.
2. **Wage agreements for the remaining agreements** — 5 more records so
   `/sok` can show real constructions and wage scopes per row instead of a fixed value.
3. **Watchword table** — `lib/mock/watchwords.ts` (FAI-004), needed for
   `/administration` and to make the protocol's highlight count derived rather than a
   literal `4`.
4. **Reminders as a writable list** — currently read-only; "Sätt påminnelse" needs a
   client-side add so the row updates.

### 5.3 Active-state matrix

Every interactive primitive needs all seven of these before it ships. Today most have
two or three, which is why the prototype feels flat.

| State | Requirement |
|---|---|
| default | — |
| hover | background shift only, never a size change (no layout jitter) |
| focus-visible | the global `3px solid var(--mi-focus)` with `3px` offset — already correct, must not be overridden |
| active / pressed | `aria-pressed` or `aria-selected` where it is a toggle |
| selected | must not be colour alone — a border weight or a check mark too |
| disabled | `aria-disabled`, plus a reason on hover; never a silently dead control |
| loading | only where something actually takes time (search) |

### 5.4 Tooltips — where they are warranted

Tooltips are a last resort, not a way to fit more prose on screen. Warranted in exactly
three places:

1. **Requirement tags** — already built, and correct: hover *and* focus, sentence also in
   the accessible description.
2. **The confidentiality icon in tables** (after §3 change 3) — the icon needs its label
   somewhere, and the row has no space for it.
3. **Truncated table cells** — long agreement names in narrow columns.

Everywhere else, the text goes inline or into `Rationale`. Any tooltip must open on focus
as well as hover, and must never be the only place information exists (WCAG 1.4.13).

---

## 6. Sequencing against the freeze

Four days. Ordered so the cut line can fall anywhere.

| Day | Work | Section | Status |
|---|---|---|---|
| 1 | `Button` consolidation, `Badge`, `Callout`, `Chip`; semantic tokens; the lint rule | §1.1, §1.2, §1.3, §2 | **done** |
| 1 | `Rationale` + the 18-sentence triage | §4 | **done** |
| 2 | `DataTable` with sticky header, hover and sort; roll out across all 7 tables | §1.1, §3.2 | **done** |
| 2 | Sticky protocol pane; confidentiality icon in tables; breadcrumb | §3.1, §3.3, §3.4 | **done** |
| 3 | `Select`, `Toggle`, `Tabs`; option catalogues; wire `/registrera` and `/sok` | §5.1, §5.2 | not started |
| 3 | `Field` / `InputField` split | §1.2 | not started |
| 4 | Two-pane `/sok`; reminder popover | §3.5, §5.1 | not started |
| 4 | Re-run axe, regenerate screenshots, update the backlog | — | **done for days 1–2** |

### What changed while building days 1–2

Two decisions in this document were revised in contact with the code. Both are recorded
rather than quietly corrected.

1. **`Rationale` uses `display: none`, not reserved space** (§4). Holding room for a
   removed paragraph left the product view full of holes. Pixel-stable comparison is
   what the *tags* need; prose is read in one view or the other.
2. **Export buttons were not given a disabled-with-reason state** (§5.1). The intent was
   honesty about what is wired up, but FR-004 and FR-013 export is required
   functionality — greying it out would read as "not supported" rather than "not in the
   demo". The demo bar already carries that signal once, globally, which is the right
   number of times. The treatment still applies to genuinely out-of-scope controls when
   day 4 adds them.

`/registrera` also gained a second screenshot (`registrera-protokoll-kallkoppling`)
captured at viewport height while scrolled, because a full-page capture of a sticky
layout flattens the behaviour into a tall empty column and shows the opposite of the
point.

**If the days compress**, cut from the bottom. Days 1 and 2 alone leave the system
visibly better and internally consistent; days 3 and 4 are what make it feel operated
rather than drawn.

**What must not be cut:** the axe re-run and the screenshot regeneration at the end. A
tender document whose images no longer match the deployed build is worse than one with
fewer images.
