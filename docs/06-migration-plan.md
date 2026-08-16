# Migration plan — TanStack Start → Next.js + Supabase

**Status: proposed, not executed.** Review before anything is touched.

Two weeks, two phases:

| | Dates | Goal | Backend |
|---|---|---|---|
| **Week 1** | Aug 17–23 | Designer visualises ideas + flows. CEO go/no-go. | None. Mock data behind the seam. Deployed to Vercel from day 1. |
| **Week 2** | Aug 24–30 | POC, if go. Lands on week 35 = oral presentation at MI. | Supabase (Postgres + Storage). |

The migration itself is **one day of work, done once, before the designer starts.**
Her day 1 is research and paper flows anyway, so it costs the project roughly nothing
if it happens today. It costs 2–3 days if it happens on Thursday.

---

## 1. Target structure

```
app/
  layout.tsx                    html/body, metadata, fonts       ← from __root.tsx
  not-found.tsx                 404                              ← from __root.tsx
  error.tsx                     error boundary                   ← from __root.tsx
  (miis)/
    layout.tsx                  AppShell wrapper, reads role cookie
    page.tsx                    Startsida                        ← routes/index.tsx
    avtal/page.tsx              Avtal – lista
    avtal/[id]/page.tsx         Avtal – detalj
    registrera/page.tsx         US-01                            ← routes/registrera.tsx
    parter/page.tsx
    forhandlingar/page.tsx
    medling/page.tsx            lista                            ← routes/medling/index.tsx
    medling/[id]/page.tsx       US-07                            ← routes/medling/arende.tsx
    partstraffar/page.tsx
    medlare/page.tsx
    sok/page.tsx                US-11                            ← routes/sok.tsx
    market/page.tsx
    administration/page.tsx
  api/                          week 2 only, and only where HTTP is genuinely needed
lib/
  domain/                       types + pure rules. Imports NOTHING.
    avtal.ts  part.ts  medling.ts  medlare.ts  marke.ts  handelse.ts
    roll.ts                     the eight roles
    status.ts                   FR-012 status logic as pure functions
  data/                         THE SEAM — week 2, the only Supabase importer
    avtal.ts  medling.ts  parter.ts  medlare.ts  start.ts  handelser.ts  marke.ts
  mock/                         week 1 seed data → week 2 becomes supabase/seed.sql
  utils.ts                      cn()                             ← src/lib/utils.ts
components/
  ui/                           shadcn, 40 files, unchanged content
  miis/
    AppShell.tsx                "use client" — nav + AI panel toggle
    primitives.tsx              Panel, Field, Button, PageHeading, ReqTag, StatusDot
    AiPanel.tsx                 "use client"
    RollVaxlare.tsx             "use client" — the role switcher (new)
    Placeholder.tsx
hooks/use-mobile.ts
supabase/                       week 2
  migrations/*.sql              schema as plain, portable SQL
  seed.sql
docs/                           unchanged
```

Two structural decisions worth flagging:

- **`medling/arende` becomes `medling/[id]`.** It's hard-coded to one case today. Making
  it a route parameter now is free and it's the shape the real thing needs.
- **`AppShell.tsx` splits.** The shell needs `useState` and `usePathname` → client
  component. But `Panel`, `Field`, `Button`, `PageHeading`, `ReqTag` and `StatusDot` are
  pure presentational and belong in `primitives.tsx` as server components. This split is
  what lets pages stay server-rendered and `await` real data in week 2.

---

## 2. File-by-file map

### Ported, content essentially unchanged

| Now | Becomes | Notes |
|---|---|---|
| `src/components/ui/*` (40 files) | `components/ui/*` | Add `"use client"` to all of them. Harmless on the pure ones, required on the Radix ones. **The one systematic edit — easy to forget.** |
| `src/styles.css` | `app/globals.css` | Same tokens. `@source "../src"` → the new dirs. |
| `src/lib/utils.ts` | `lib/utils.ts` | `cn()` |
| `src/hooks/use-mobile.tsx` | `hooks/use-mobile.ts` | |
| `src/components/miis/AiPanel.tsx` | `components/miis/AiPanel.tsx` | + `"use client"` |
| `src/components/miis/Placeholder.tsx` | `components/miis/Placeholder.tsx` | |
| `public/*` | `public/*` | |
| `.prettierrc`, `.prettierignore` | unchanged | |
| `docs/*` | unchanged | |

### Ported with mechanical edits

Every route file gets the same four changes:

```diff
- export const Route = createFileRoute("/parter")({
-   head: () => ({ meta: [{ title: "…" }, { name: "description", content: "…" }] }),
-   component: Parter,
- });
+ export const metadata = { title: "…", description: "…" };
+ export default function Parter() { … }

- import { Link } from "@tanstack/react-router";  →  import Link from "next/link";
- <Link to="/registrera">                          →  <Link href="/registrera">
- useRouterState({ select: s => s.location.pathname })  →  usePathname()
```

| Now | Becomes |
|---|---|
| `src/routes/__root.tsx` | `app/layout.tsx` + `app/not-found.tsx` + `app/error.tsx` |
| `src/routes/index.tsx` | `app/(miis)/page.tsx` |
| `src/routes/registrera.tsx` | `app/(miis)/registrera/page.tsx` |
| `src/routes/sok.tsx` | `app/(miis)/sok/page.tsx` |
| `src/routes/medling/index.tsx` | `app/(miis)/medling/page.tsx` |
| `src/routes/medling/arende.tsx` | `app/(miis)/medling/[id]/page.tsx` |
| `src/routes/{avtal,parter,forhandlingar,partstraffar,medlare,market,administration}.tsx` | `app/(miis)/<name>/page.tsx` |
| `src/components/miis/AppShell.tsx` | `components/miis/AppShell.tsx` + `primitives.tsx` |

### Deleted

| File | Why |
|---|---|
| `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts` | TanStack Start plumbing |
| `src/lib/error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts` | Lovable-specific error reporting |
| `vite.config.ts` | → `next.config.ts` |
| `bun.lock`, `bunfig.toml` | npm |
| `.lovable/project.json`, `AGENTS.md` | No longer a Lovable project |
| `src/routes/README.md` | TanStack routing notes |

### Rewritten

`package.json` (Next 16, React 19, Tailwind v4, shadcn deps — Radix deps carry over
unchanged), `tsconfig.json`, `eslint.config.js`, `components.json`.

**Dropped dependency: `@tanstack/react-query`.** It's currently wired up in `__root.tsx`
but no screen uses it — all data is hard-coded. With server components fetching through
`lib/data/`, it isn't needed. Add it back in week 2 only if a screen needs client-side
mutation.

---

## 3. Domain types

Derived from the requirements' data model (§4.2, §4.5, Appendix A) and from what the
four built screens actually render. Week 1 implements only what the screens need; the
rest is the known target so nothing has to be renamed later.

```ts
// lib/domain/roll.ts
export type Roll =
  | "avtalsadministrator" | "medlingsadministrator" | "medlaradministrator"
  | "statistikanvandare"  | "systemadministrator"   | "behorighetsadministrator"
  | "publik"              | "medlare";

// lib/domain/avtal.ts
export type Registreringsstatus = "ofullstandig" | "klar";
export type Avtalskonstruktion = 1|2|3|4|5|6|7;   // the seven MI-defined constructions

export interface Avtal {
  id: string;
  avtalsomrade: string;
  namn: string;
  alternativtNamn?: string;
  ago: PartRef;  ato: PartRef;         // one registration per party (§4.2)
  avtalstyp: string;
  registreringsstatus: Registreringsstatus;
  rapporturval: Rapporturval;          // eurofound / minimilon / webbplats / konjunktur
  konfidentiell: boolean;              // D-001
}

export interface Loneavtal {            // one row per bargaining round (FA-002)
  avtalId: string;
  konstruktion: Avtalskonstruktion;     // FA-007
  loneutrymmeProcent?: number;          // FA-008
  kostnadsramProcent?: number;
  individgaranti: boolean;              // FA-010
  arbetstidsforkortning?: { ja: boolean; kostnadProcent?: number };  // FA-009
  jamstalldhetsflagga: boolean;         // FA-011
  industrimarke: boolean;               // FA-012
  teckningsdatum?: string;
  giltigFrom: string; giltigTom: string;
  lonerevision?: { datum: string; procent: number };
  lagstalon?: { belopp: number; yrkesgrupp: string; revisionsdatum: string }[];  // FA-013
}

export interface AllmannaVillkor {      // separate validity period (FA-003, FA-004)
  avtalId: string; teckningsdatum?: string; giltigFrom: string; giltigTom: string;
}
```

Same pattern for `Part` (AGO/ATO + `namnhistorik[]`, FP-001/002/004), `Samverkansorgan`,
`Forhandling`, `Forhandlingsordningsavtal`, `Medlingsarende` + `Medlingsresultat`
(FF-010's five fields), `Medlare` (+ `historik[]` with `position: "etta" | "tvaa"`),
`Partstraff`, `Marke`, `Handelse` (FH-002), `Andring` (FH-001), `Dokument` (FD-001),
`Bevakningsord` (FAI-004).

### The status rule, as code

FR-012 is currently a raw `color: "green"` string in each route file. It becomes one
pure function — and note the return type makes it **impossible to render colour without
a label**, which is exactly what WCAG requires:

```ts
// lib/domain/status.ts
export type AvtalStatus = "nytecknat" | "efter-medling" | "kvarstaende";

export function avtalStatus(a: Avtal): {
  kod: AvtalStatus;
  farg: "green" | "red" | "blue";
  etikett: string;        // "Nytecknat utan medling" | "Tecknat efter medling" | "Kvarstående"
}
```

`StatusDot` then takes the whole object and always renders dot + text. The accessibility
requirement stops being a thing anyone can forget.

---

## 4. The data seam

Week 1 these read from `lib/mock/`. Week 2 the bodies change and **no page changes.**

```ts
// lib/data/start.ts   ← the role switcher lives on this
export async function getStartsida(roll: Roll): Promise<Startsida>

// lib/data/avtal.ts
export async function listAvtal(filter?: AvtalFilter): Promise<Avtal[]>
export async function getAvtal(id: string, per?: string): Promise<AvtalDetalj | null>
                                        //  ↑ "valid at date" — FA-020, and the hook FH-003 needs

// lib/data/medling.ts
export async function listMedlingsarenden(): Promise<Medlingsarende[]>
export async function getMedlingsarende(id: string): Promise<MedlingsarendeDetalj | null>

// lib/data/{parter,medlare,handelser,marke}.ts — same shape
```

A page then looks like this, and looks the same in both weeks:

```tsx
export default async function MedlingsarendePage({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params;
  const arende = await getMedlingsarende(id);
  if (!arende) notFound();
  return <MedlingsarendeVy arende={arende} />;
}
```

Note `getAvtal(id, per?)` takes a date from day one. That's the snapshot seam (FH-003) —
free to include now, expensive to retrofit.

---

## 5. Role switching

Week 1: a `"use client"` dropdown writes a `miis_roll` cookie; `app/(miis)/layout.tsx`
reads it server-side and passes the role down. `getStartsida(roll)` returns different
panels per role.

This is deliberately how a real session works, so week 2 replaces the cookie's *source*
(Supabase Auth, or a fake login) without touching any screen. And for the oral
presentation it's one click that repaints the dashboard — the strongest thirty seconds
available to you against the "role-based user scenarios" criterion.

---

## 6. Guardrails

**The migration rule, enforced not hoped for** — in `eslint.config.js`:

```js
{
  files: ["app/**", "components/**", "lib/domain/**", "lib/mock/**"],
  rules: { "no-restricted-imports": ["error", {
    patterns: [{ group: ["@supabase/*"], message: "Supabase belongs in lib/data/ only" }]
  }]}
}
```

**What the designer touches:** `app/(miis)/**/page.tsx` and `components/miis/`. Nothing
else. `CLAUDE.md` gets the four structural rules (domain imports nothing · data is the
only Supabase importer · pages are server components that await data · interactive bits
are `"use client"` under `components/miis/`) plus a map of where things live — which is
also the cheapest token saving available, since Claude stops searching when it knows.

**GitNexus:** index once after this lands, then re-index at the start of week 2. Not
before — the graph should reflect the final shape, and at today's size direct reading is
cheaper than indexing.

---

## 7. Execution order

1. Branch `next-migration`. The current state stays on `main`, recoverable.
2. Scaffold: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, globals.
3. Move `components/ui/*` + `"use client"` sweep. Verify one shadcn component renders.
4. Split `AppShell.tsx` → shell + `primitives.tsx`.
5. Port routes **one at a time**, starting with `/`. Screenshot after each.
6. Extract the inline data → `lib/mock/` + `lib/domain/` + `lib/data/`.
7. Delete the TanStack plumbing.
8. Role switcher.
9. Deploy to Vercel, get the preview URL to the CEO.

**Acceptance test:** the four baseline screenshots in `screenshots/` were taken at
1440px before any of this. Re-shoot the same four routes after the port and diff. Visual
parity is the bar — this migration should change nothing a user can see.

---

## 8. Risks

| Risk | Handling |
|---|---|
| **Lovable round-trip dies.** The repo is tied to the `tanstack_start_ts_current` template. | Confirm with the CEO first. She reviews via the Vercel preview URL instead. This is the one irreversible item. |
| **The POC doesn't port to .NET/SQL Server.** The tender promises on-prem ASP.NET Core + SQL Server, no cloud (NFA-001). | Be explicit internally that the POC proves UX and flow, not the delivery architecture. The `lib/domain/` types and the plain-SQL schema are the parts that carry over; everything Supabase-shaped is knowingly disposable. |
| **RSC footgun.** `useState` in a server component is the error a vibe-coding designer will hit most. | The split in step 4 plus the `"use client"` sweep in step 3 handles it structurally, and the rule goes in `CLAUDE.md`. |
| **Migration overruns into her design time.** | Hard stop: if it isn't visually at parity by end of Monday, abandon the branch and stay on TanStack Start with only the `lib/data/` seam (~2 hours). Nothing is lost — `main` is untouched. |
| Only synthetic data ever reaches Vercel/Supabase. | Aligned with T-002, which asks for anonymised or fictitious protocols anyway. |
