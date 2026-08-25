# Accessibility evidence (NFUI-003)

NFUI-003 asks for WCAG 2.1 level AA. A claim in a tender costs nothing and proves
nothing; a test result attached to it is very unlikely to be matched by a competing
bidder. This directory holds the result and the instructions for reproducing it, so the
figure in the tender is always the figure the current build actually produces.

## Running the check

The app must be running. `axe-core` is a devDependency; it is staged into `public/` for
the duration of the run because the page loads it as a same-origin script.

```bash
npm run dev
```

```bash
npm run a11y:stage
```

Then, in the browser at http://localhost:8080, on each route:

```js
axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }).then(r => console.table(r.violations))
```

Afterwards, remove the staged copy so it never reaches a deployment:

```bash
npm run a11y:clean
```

## What automated testing does not cover

axe finds roughly a third of WCAG issues. It cannot judge whether a heading is
*meaningful*, whether an alternative text is *correct*, or whether a flow is usable by
keyboard alone. The manual checks in `axe-2026-08-17.md` exist for that reason and
should be repeated whenever a screen changes.

`axe-2026-08-18.md` records the run for US-01 step 1, the protocol upload. It is scoped
to `/registrera` rather than the whole app, and covers all five states of that screen —
a screen with an asynchronous step has more than one state to test.

## Open questions that affect this work

Browsers and minimum screen resolution are still unanswered by MI (question deadline
2026-08-18). The responsive breakpoints in `AppShell.tsx` assume 1024px for the full
sidebar and stack below 768px; if MI names a lower minimum, the breakpoints move.
