/**
 * The consistency sweep — is the system one system?
 *
 * `sweep.mjs` asks whether each screen works. This asks whether the screens
 * agree with each other, which is a different failure and a slower one: nothing
 * is broken, but a reader learns the interface twice because the same idea is
 * dressed two ways.
 *
 * Five questions, each mechanically answerable:
 *
 *   1. **Does one act have one name?** Two screens that save with *Spara* and
 *      *Registrera* teach the officer that the two are different acts.
 *   2. **Does every anchor resolve?** A link to `#loneavtal` that names nothing
 *      scrolls nowhere — and until yesterday, opened the wrong tab.
 *   3. **Is a state word always the same component?** FR-012 is a `StatusDot`;
 *      every other state is a `Badge`. A state rendered as bare text is a state
 *      the reader has to know to look for.
 *
 * **Confirmation coverage is deliberately not here.** Whether a screen says
 * anything when it acts cannot be read from the DOM at load: every confirmation
 * in this system is conditional — `{saved && <Callout live>}` — so a page that
 * confirms perfectly well looks silent until somebody presses something. The
 * browser version of this check reported eight false positives on every run,
 * which is how a checker teaches people to ignore it. It is answered statically
 * instead: every component holding a save-like handler carries a live callout,
 * except `Toggle` and `Marked`, whose feedback is the state word beside them.
 *
 * Reported, not gated: several of these need a human to judge whether a
 * difference is drift or a distinction. The point is to put them on one page.
 *
 *   node scripts/consistency.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:8080";

const ROUTES = [
  ["agreement-admin", "/"],
  ["agreement-admin", "/avtal"],
  ["agreement-admin", "/avtal/A-001"],
  ["agreement-admin", "/avtal/A-010"],
  ["agreement-admin", "/avtal/ny"],
  ["agreement-admin", "/registrera"],
  ["agreement-admin", "/registrera?forts=1"],
  ["agreement-admin", "/parter"],
  ["agreement-admin", "/parter/ny"],
  ["agreement-admin", "/parter/P-015"],
  ["agreement-admin", "/dokument"],
  ["agreement-admin", "/market"],
  ["agreement-admin", "/rapporter"],
  ["agreement-admin", "/forhandlingar"],
  ["mediation-admin", "/medling"],
  ["mediation-admin", "/medling/M-2027-12"],
  ["mediation-admin", "/partstraffar"],
  ["mediation-admin", "/partstraffar/PT-2027-04"],
  ["mediator-admin", "/medlare"],
  ["statistics-user", "/sok"],
  ["system-admin", "/administration"],
  ["permission-admin", "/administration/anvandare"],
  ["public", "/allmanheten"],
  ["public", "/allmanheten/A-013"],
];

const cookies = (role) =>
  [
    ["miis_role", role],
    ["miis_dataset", "normal"],
    ["miis_lang", "sv"],
    ["miis_reqtags", "off"],
  ].map(([name, value]) => ({ name, value, domain: "localhost", path: "/" }));

/** Verbs that mean "commit what I typed". One idea, so one word. */
const SAVE_VERB = /^(spara|registrera|lägg till|skapa|godkänn|publicera|byt|ändra|förordna|koppla)/i;

const actions = new Map(); // label -> Set(route)
const anchors = [];        // { route, href, resolves }
const bareStates = [];     // state-looking text outside Badge/StatusDot

const browser = await chromium.launch();

for (const [role, route] of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies(cookies(role));
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  /* Open every tab: a screen hides most of itself, and so does its drift. */
  const tabs = await page.$$('main [role="tab"]');
  for (const t of tabs) {
    await t.click().catch(() => {});
    await page.waitForTimeout(120);
  }

  const found = await page.evaluate(
    ({ verbSrc }) => {
      const verb = new RegExp(verbSrc, "i");
      const vis = (el) => el.getClientRects().length > 0;

      const labels = [...document.querySelectorAll("main button")]
        .filter(vis)
        .map((b) => b.textContent.trim().replace(/\s+/g, " "))
        .filter((t) => t.length > 0 && t.length < 40)
        /* A sortable column header is a heading wearing a button. */
        .filter((t) => !/Sortera på/.test(t))
        .filter((t) => verb.test(t));

      const hrefs = [...document.querySelectorAll('main a[href*="#"]')]
        .filter(vis)
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && h.includes("#") && !h.endsWith("#"));

      const anchorResolves = hrefs.map((h) => {
        const id = h.split("#")[1];
        const samePage = h.startsWith("#") || h.split("#")[0] === location.pathname;
        return {
          href: h,
          /* Only same-page anchors can be checked from here; a cross-page one
             is the destination's problem and is checked when we visit it. */
          checkable: samePage,
          resolves: samePage ? Boolean(document.getElementById(id)) : true,
        };
      });

      /* A word that looks like a state but is neither a Badge nor a StatusDot.
         Deliberately narrow: only the exact vocabulary the system uses. */
      const STATE_WORDS = /^(Aktiv|Inaktiv|Publicerat|Ej publicerat|Ofullständig|Klar|Pågående|Avslutad|Pausat)$/;
      const bare = [...document.querySelectorAll("main span, main td, main p")]
        .filter(vis)
        .filter((el) => el.children.length === 0)
        .filter((el) => STATE_WORDS.test(el.textContent.trim()))
        .filter((el) => !el.closest("[data-badge], [data-status-dot]"))
        .map((el) => el.textContent.trim());

      return { labels, anchorResolves, bare: [...new Set(bare)] };
    },
    { verbSrc: SAVE_VERB.source },
  );

  for (const l of found.labels) {
    if (!actions.has(l)) actions.set(l, new Set());
    actions.get(l).add(route);
  }
  for (const a of found.anchorResolves) {
    if (a.checkable && !a.resolves) anchors.push(`${route} :: ${a.href}`);
  }
  for (const s of found.bare) bareStates.push(`${route} :: "${s}"`);

  await ctx.close();
}

await browser.close();

const show = (title, list) => {
  console.log(`\n${title}: ${list.length}`);
  for (const l of [...new Set(list)]) console.log("  • " + l);
};

/* Group action labels by their leading verb so drift shows up as a cluster. */
console.log("\nhandlingsetiketter, grupperade på verb:");
const byVerb = new Map();
for (const [label, routes] of actions) {
  const v = (label.match(SAVE_VERB) ?? [""])[0].toLowerCase();
  if (!byVerb.has(v)) byVerb.set(v, []);
  byVerb.get(v).push({ label, routes: [...routes] });
}
for (const [verb, items] of [...byVerb].sort()) {
  console.log(`  ${verb} (${items.length})`);
  for (const i of items.sort((a, b) => a.label.localeCompare(b.label))) {
    console.log(`      "${i.label}"  — ${i.routes.length} vy${i.routes.length > 1 ? "er" : ""}`);
  }
}

show("ankare som inte pekar på något", anchors);
show("statusord utanför Badge/StatusDot", bareStates);
