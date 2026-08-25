/**
 * The behavioural sweep — what the accessibility and copy audits cannot see.
 *
 * Every defect this project has shipped and had caught by a human belongs to
 * one family: **a control that looks live and is not**. A `disabled` button
 * wearing a reason about the demo; a tab that switches and changes nothing; a
 * save that announces itself and leaves the register untouched; a report whose
 * result is a link to somewhere else. None of those fail a type check, a lint
 * rule, a unit test or an axe scan, because every one of them *renders
 * correctly*. They fail only when somebody presses the thing and watches.
 *
 * So this presses things. For every route as the role that owns it:
 *
 *   1. **Dead controls** — a `<button>` that is `disabled`, reported with its
 *      reason so a real refusal ("the last authorisation administrator") can be
 *      told apart from an unbuilt one ("not active in the demo").
 *   2. **Console errors** — a React key warning or a hydration mismatch is a
 *      defect an evaluator may hit and we would never see.
 *   3. **Empty panels** — a heading with nothing under it, which is the shape a
 *      panel takes when its data went missing.
 *   4. **Dead links** — an `href` to a route that 404s.
 *
 * It exits non-zero on anything in the first two categories, so it can gate a
 * merge the way `audit.mjs` does. Categories 3 and 4 are reported for reading:
 * an empty panel is sometimes the honest answer.
 *
 *   node scripts/sweep.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:8080";

/** Route, and the role that owns it — the same pairs `audit.mjs` sweeps. */
const ROUTES = [
  ["agreement-admin", "/"],
  ["agreement-admin", "/avtal"],
  ["agreement-admin", "/avtal/A-001"],
  /* Ofullständig: the state the mark and the gap sentence live in. */
  ["agreement-admin", "/avtal/A-004"],
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
  ["agreement-admin", "/genomgang"],
];

/**
 * A refusal that names the demo rather than a rule.
 *
 * "Ej aktiv i demon" states a fact about the prototype, which is never the
 * answer to why a system refuses something: an evaluator reading it learns we
 * did not build the feature and learns nothing about the system MI would buy.
 * A refusal grounded in a requirement — the last authorisation administrator,
 * a registration that is not complete — is the opposite and must survive.
 */
const DEMO_EXCUSE = /ej aktiv i demon|not active in the demo|inte aktiv|kommer i steg|coming in step/i;

const cookies = (role) =>
  [
    ["miis_role", role],
    ["miis_dataset", "normal"],
    ["miis_lang", "sv"],
    ["miis_reqtags", "off"],
  ].map(([name, value]) => ({ name, value, domain: "localhost", path: "/" }));

const findings = { dead: [], errors: [], empty: [], links: [] };

const browser = await chromium.launch();

for (const [role, route] of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies(cookies(role));
  const page = await ctx.newPage();

  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

  await page.goto(BASE + route, { waitUntil: "networkidle" });

  /* Every tab panel, not just the one that opens: a tabbed screen hides most
     of itself, and the defects live in the parts nobody opened. */
  const tabs = await page.$$('main [role="tab"]');
  for (let i = 0; i < tabs.length; i++) {
    await tabs[i].click().catch(() => {});
    await page.waitForTimeout(150);
  }

  const found = await page.evaluate((src) => {
    const excuse = new RegExp(src, "i");
    const visible = (el) => el.getClientRects().length > 0;

    const dead = [...document.querySelectorAll("main button[disabled]")]
      .filter(visible)
      .map((b) => ({
        label: b.textContent.trim().replace(/\s+/g, " ").slice(0, 48),
        reason: (b.getAttribute("title") ?? "").slice(0, 90),
      }))
      .filter((d) => excuse.test(d.reason) || d.reason === "");

    /*
      A heading whose panel has nothing under it.

      The first version read `h.parentElement`, which for a `Panel` is the
      heading's own wrapper — so every panel in the system looked empty and the
      check reported 74 of them. It has to climb to the element that actually
      holds the content, then subtract the heading.
    */
    const empty = [...document.querySelectorAll("main h2, main h3")]
      .filter(visible)
      .filter((h) => {
        let box = h.parentElement;
        for (let i = 0; i < 4 && box; i++) {
          const rest = box.innerText.replace(h.innerText, "").trim();
          if (rest.length >= 3) return false;
          box = box.parentElement;
        }
        return true;
      })
      .map((h) => h.textContent.trim().slice(0, 60));

    const links = [
      ...new Set(
        [...document.querySelectorAll('main a[href^="/"]')]
          .filter(visible)
          .map((a) => a.getAttribute("href").split("#")[0].split("?")[0]),
      ),
    ];

    return { dead, empty, links };
  }, DEMO_EXCUSE.source);

  for (const d of found.dead) {
    findings.dead.push(`${route} [${role}] :: "${d.label}" — ${d.reason || "(no reason given)"}`);
  }
  for (const e of errors) findings.errors.push(`${route} [${role}] :: ${e}`);
  for (const e of found.empty) findings.empty.push(`${route} [${role}] :: ${e}`);

  /* A link that 404s is a dead control wearing a different hat. */
  for (const href of found.links) {
    if (ROUTES.some(([, r]) => r === href)) continue;
    const res = await page.request.get(BASE + href).catch(() => null);
    if (!res || res.status() >= 400) {
      findings.links.push(`${route} [${role}] :: ${href} → ${res ? res.status() : "failed"}`);
    }
  }

  await ctx.close();
}

await browser.close();

const show = (title, list) => {
  console.log(`\n${title}: ${list.length}`);
  for (const l of [...new Set(list)]) console.log("  • " + l);
};

show("dead controls (disabled with a demo excuse or no reason)", findings.dead);
show("console errors", findings.errors);
show("empty panels", findings.empty);
show("links that do not resolve", findings.links);

const blocking = findings.dead.length + findings.errors.length + findings.links.length;
console.log(`\n${blocking === 0 ? "clean" : blocking + " blocking"}`);
process.exit(blocking === 0 ? 0 : 1);
