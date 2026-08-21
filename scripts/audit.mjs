/**
 * The two sweeps that are not `npm test` — accessibility, and requirement text.
 *
 * Both need the app running (`npm run dev`, port 8080) because both are about
 * what a browser actually renders, which is the only place either defect shows
 * up. They have caught real faults repeatedly and were being re-typed by hand
 * every time; this is that script, committed.
 *
 *   npm run audit          both sweeps
 *   npm run audit -- --a11y      only the accessibility one
 *   npm run audit -- --copy      only the requirement-text one
 *
 * Exits non-zero if either sweep finds anything, so it can gate a merge.
 *
 * **Accessibility.** NFUI-003 makes WCAG 2.1 AA a requirement rather than a
 * preference, so axe-core runs over every route **as every role** — the same
 * screen refused to one role and rendered to another is two different documents
 * — filtered to the WCAG A/AA tags, because axe's best-practice rules would
 * otherwise drown the real failures. Alongside it, a check that no route scrolls
 * horizontally between 375 px and 1920 px.
 *
 * **Requirement text.** The product view must not cite the specification at the
 * person using it: requirement IDs, § references and appendix names belong on
 * the `miis_reqtags` layer or in a `Rationale`. This loads every route with the
 * tags off and scans what is visible.
 *
 * Two things are deliberately **not** scanned, for the same reason: the demo
 * strip and `/genomgang`. Both are reviewer material, plainly labelled as
 * outside MIIS, and citing MI's requirements is exactly what the guided
 * walkthrough is for.
 */

import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.MIIS_BASE_URL ?? "http://localhost:8080";

const only = process.argv.includes("--a11y")
  ? "a11y"
  : process.argv.includes("--copy")
    ? "copy"
    : "both";

/**
 * Route and the role it is walked as. Every route appears once per role in the
 * accessibility sweep; the copy sweep uses the role named here, because a screen
 * refused to a role has no product copy to check.
 */
const ROUTES = [
  ["agreement-admin", "/"],
  ["agreement-admin", "/avtal"],
  ["agreement-admin", "/avtal/A-001"],
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

/** The roles every route is loaded as, for the authorisation half of the sweep. */
const ROLES = ["agreement-admin", "system-admin", "public", "mediator"];

const WIDTHS = [375, 768, 1280, 1920];

/**
 * What must not appear in the product view.
 *
 * `Bilaga A`–`Bilaga F` are deliberately absent from this pattern: MI's own
 * scanned protocol names its appendices that way, and the transcription of a
 * document is not our copy.
 */
const REQUIREMENT_TEXT =
  /\b(?:NF[ÅAULMP]?|FA|FR|FH|FD|FF|FM|FE|FS|FSD|FAI|FP|D|T|L)-\d{3}\b|Bilaga \d|Appendix \d|kravspecifikation|demoläge|demo mode/gi;

/** `/registrera` opens on an empty drop zone; every check past it needs a file. */
async function uploadProtocol(page) {
  const input = page.locator('input[type="file"]');
  if ((await input.count()) === 0) return;
  await input.setInputFiles({
    name: "Seko Kommunikation 2025-27.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(184320),
  });
  await page.waitForSelector("#steg-ai", { timeout: 15000 });
  await page.waitForTimeout(200);
}

function cookies(role, reqTags) {
  return [
    { name: "miis_role", value: role, url: BASE },
    { name: "miis_dataset", value: "normal", url: BASE },
    { name: "miis_reqtags", value: reqTags, url: BASE },
  ];
}

async function accessibility(browser) {
  const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
  let violations = 0;
  let overflow = 0;

  for (const role of ROLES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addCookies(cookies(role, "on"));
    const page = await ctx.newPage();

    for (const [, route] of ROUTES) {
      const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
      if (!res || res.status() >= 500) {
        console.error(`HTTP ${res?.status() ?? "?"}  ${role}  ${route}`);
        violations += 1;
        continue;
      }
      if (route.startsWith("/registrera")) await uploadProtocol(page);

      await page.addScriptTag({ content: axe });
      const found = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          resultTypes: ["violations"],
          /* The WCAG tags only. axe's best-practice rules flag things NFUI-003
             does not require, and a sweep that reports both cannot be used as a
             gate. */
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });
        return result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.length,
          target: v.nodes[0]?.target?.join(" "),
        }));
      });
      if (found.length > 0) {
        console.error(`axe  ${role}  ${route}  ${JSON.stringify(found)}`);
        violations += found.length;
      }

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        const scrolls = await page.evaluate(
          () =>
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        if (scrolls) {
          console.error(`overflow  ${role}  ${route}  @${width}`);
          overflow += 1;
        }
      }
      await page.setViewportSize({ width: 1280, height: 900 });
    }
    await ctx.close();
  }

  console.log(`accessibility: ${violations} violations, ${overflow} overflow`);
  return violations + overflow;
}

async function requirementText(browser) {
  const leaks = new Set();

  for (const [role, route] of ROUTES) {
    /* Reviewer material, not product. See the note at the top of this file. */
    if (route === "/genomgang") continue;

    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await ctx.addCookies(cookies(role, "off"));
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (route.startsWith("/registrera")) await uploadProtocol(page);

    /* `main` only. The demo strip is reviewer tooling and is allowed to cite. */
    const text = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
    for (const hit of text.match(REQUIREMENT_TEXT) ?? []) {
      const line = text.split("\n").find((l) => l.includes(hit)) ?? hit;
      leaks.add(`${route} :: ${line.trim().slice(0, 140)}`);
    }

    /* And the AI drawer, whose three tabs are product copy like any other. */
    const launcher = page.locator("[data-ai-launcher]");
    if ((await launcher.count()) > 0) {
      await launcher.click();
      await page.waitForTimeout(250);
      const drawer = page.locator(".fixed.inset-0");
      for (const tab of ["ask", "tasks", "queue"]) {
        const control = drawer.locator('[role="tab"]').nth(["ask", "tasks", "queue"].indexOf(tab));
        if ((await control.count()) > 0) {
          await control.click();
          await page.waitForTimeout(150);
        }
        const body = await drawer.innerText();
        for (const hit of body.match(REQUIREMENT_TEXT) ?? []) {
          const line = body.split("\n").find((l) => l.includes(hit)) ?? hit;
          leaks.add(`${route} [AI] :: ${line.trim().slice(0, 140)}`);
        }
      }
    }
    await ctx.close();
  }

  console.log(`requirement text in the product view: ${leaks.size}`);
  for (const leak of leaks) console.error("  • " + leak);
  return leaks.size;
}

const browser = await chromium.launch();
let problems = 0;
if (only !== "copy") problems += await accessibility(browser);
if (only !== "a11y") problems += await requirementText(browser);
await browser.close();

process.exit(problems === 0 ? 0 : 1);
