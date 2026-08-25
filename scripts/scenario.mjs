/**
 * The five transitions — what neither the unit suite nor the sweeps can reach.
 *
 * `npm test` proves the rules. `npm run audit` proves the markup. `npm run
 * sweep` proves no control is dead. All three look at one screen at a time,
 * and every defect this project has shipped has lived in the **seam between
 * two screens**: an act performed as one role and looked for as another, or
 * looked for on a register the act never reached.
 *
 * So this walks the five from `docs/26-testworkflow.md` end to end, switching
 * role mid-flow the way an officer's day does — and asserts the *result*, not
 * that a button existed.
 *
 *   npm run scenario
 */

import { Buffer } from "node:buffer";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:8080";

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/*
  A check that could not be performed is not a check that passed.

  The first run of this file reported three greens that were nothing of the
  kind: an agreement that was already published, a queue with nothing to
  reject, and no active authorisation administrator to try to lock out. Each
  had fallen through to a condition that happened to be true. A suite that goes
  green because it could not find the thing to test is worse than no suite —
  it is the dead control, one level up.
*/
const unreachable = (name, why) => {
  results.push({ name, ok: false, detail: why });
  console.log(`  FAIL  ${name} — kunde inte provas: ${why}`);
};

/* Next's client navigation resolves `networkidle` before the tree it renders
   settles, so a locator run immediately after finds an empty page. */
const settle = async () => {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(700);
};

const browser = await chromium.launch();
/* One context for the whole run: the session's own records live in cookies, so
   a fresh context per step would throw away the thing being tested. */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const cookie = (name, value) => ({ name, value, domain: "localhost", path: "/" });
await ctx.addCookies([
  cookie("miis_dataset", "normal"),
  cookie("miis_lang", "sv"),
  cookie("miis_reqtags", "off"),
  /* The session's own records start empty. Without this the second run finds
     the first run's agreement already published and reports a green for a
     transition it never performed. */
  cookie("miis_drafts", ""),
  cookie("miis_published", ""),
  cookie("miis_completed", ""),
]);
const page = await ctx.newPage();

const asRole = async (role) => {
  await ctx.addCookies([cookie("miis_role", role)]);
};

const rows = () => page.locator("main table tbody tr");

/* ── 1 · Publish, change role, find it ─────────────────────────────────────
   Bilaga 2 §3.5's ninth bullet, whose own wording is that the agreement
   becomes available to users with access to published information. */
console.log("\n1 · publicera → byt roll → hitta avtalet");
await asRole("public");
await page.goto(BASE + "/allmanheten", { waitUntil: "networkidle" });
const publishedBefore = await rows().count();

await asRole("agreement-admin");
/* A-010 is the one the sample data leaves complete, signed and unpublished —
   the only state in which `mayPublish` says yes. Hard-coding a different id
   made this check unreachable rather than failing. */
await page.goto(BASE + "/avtal/A-010", { waitUntil: "networkidle" });
const publishBtn = page.getByRole("button", { name: /^Publicera avtalet$/ });
if ((await publishBtn.count()) === 0 || !(await publishBtn.isEnabled())) {
  unreachable("publiceringen registreras på avtalet", "A-010 gick inte att publicera");
} else {
  await publishBtn.click();
  await page.waitForTimeout(700);
  check(
    "publiceringen registreras på avtalet",
    (await page.getByText(/Publicerat \d{4}-\d{2}-\d{2}/).count()) > 0,
  );
}

await asRole("public");
await page.goto(BASE + "/allmanheten", { waitUntil: "networkidle" });
const publishedAfter = await rows().count();
check(
  "avtalet syns på allmänhetens dator efter rollbytet",
  publishedAfter === publishedBefore + 1,
  `${publishedBefore} → ${publishedAfter}`,
);

/* ── 2 · Register a new agreement, then be refused publication ─────────── */
console.log("\n2 · registrera nytt avtal → publicering vägras med skäl");
await asRole("agreement-admin");
await page.goto(BASE + "/avtal", { waitUntil: "networkidle" });
const registerBefore = await rows().count();

await page.goto(BASE + "/avtal/ny", { waitUntil: "networkidle" });
await page.fill("#na-name", "Testflödesavtalet");
await page.fill("#na-area", "Testområde");
for (const id of ["#na-ago", "#na-ato", "#na-type", "#na-sector"]) {
  const opts = await page.locator(`${id} option`).all();
  if (opts.length > 1) await page.selectOption(id, await opts[1].getAttribute("value"));
}
/* Signed, because `mayPublish` has two conditions and transition 3 goes on to
   test the other one. The refusal transition 2 asserts is about the
   registration being incomplete, which a signing date does not change. */
await page.fill("#na-signed", "2027-04-01");
await page.getByRole("button", { name: /Spara avtalet/ }).click();
await page.waitForTimeout(600);

const openIt = page.getByRole("link", { name: /Öppna avtalet/ });
check("handlingen slutar på avtalet, inte på registret", (await openIt.count()) > 0);
if ((await openIt.count()) > 0) await openIt.click();
await settle();

const refused = page.getByRole("button", { name: /^Publicera avtalet$/ });
check(
  "publicering vägras på en ofullständig registrering",
  (await refused.count()) > 0 && !(await refused.isEnabled()),
  (await refused.count()) > 0 ? ((await refused.getAttribute("title")) ?? "").slice(0, 60) : "",
);

await page.goto(BASE + "/avtal", { waitUntil: "networkidle" });
check("avtalet finns i registret", (await rows().count()) === registerBefore + 1,
  `${registerBefore} → ${await rows().count()}`);

/* ── 3 · Klarmarkera → publicera → hitta det som allmänheten ──────────────
   Där transition 2 slutade, och det var där defekten bodde: vägran var rätt,
   och ingen frågade vad handläggaren gör sedan. Ingenting gjorde det. */
console.log("\n3 · klarmarkera den ofullständiga registreringen → publicera");
await asRole("public");
await page.goto(BASE + "/allmanheten", { waitUntil: "networkidle" });
const publicBeforeMark = await rows().count();

await asRole("agreement-admin");
await page.goto(BASE + "/avtal", { waitUntil: "networkidle" });
const newest = page.getByRole("link", { name: /Testflödesavtalet/ });
if ((await newest.count()) === 0) {
  unreachable("klarmarkeringen finns", "avtalet från steg 2 gick inte att hitta");
} else {
  await newest.first().click();
  await settle();

  const mark = page.getByRole("button", { name: /^Markera registreringen som klar$/ });
  if ((await mark.count()) === 0) {
    unreachable("klarmarkeringen finns", "kontrollen fanns inte på en ofullständig registrering");
  } else {
    /* Vad som saknas ska stå på posten — annars är klarmarkeringen en knapp
       utan upplysning om vad man skriver under på. */
    /* The checklist, not the old inline sentence: a count and five lines, so
       the officer can see both what is done and what is left before they sign
       the registration off. */
    const panel = await page.locator("main").innerText();
    check(
      "posten säger hur långt registreringen kommit",
      /Registrerat: \d+ av \d+/.test(panel),
      (panel.match(/Registrerat: \d+ av \d+/) ?? [""])[0],
    );
    check("posten räknar upp vad som återstår", /återstår|Teckningsdatum/.test(panel));
    await mark.click();
    /* Wait for the state, not for a duration: the mark is written in the
       browser and the badge is re-rendered on the server, so a fixed timeout
       raced it. The signal is the control's own disappearance —
       `mayMarkComplete` is false once the registration is complete, which is
       unambiguous in a way that matching a badge's text is not. */
    const marked = await mark
      .waitFor({ state: "detached", timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    await settle();
    check("registreringen är klarmarkerad", marked);
    const pub = page.getByRole("button", { name: /^Publicera avtalet$/ });
    check(
      "publiceringen är nu möjlig på samma avtal",
      (await pub.count()) > 0 && (await pub.isEnabled()),
    );
    if ((await pub.count()) > 0 && (await pub.isEnabled())) {
      await pub.click();
      await page.waitForTimeout(700);
      check(
        "publiceringen registreras",
        (await page.getByText(/Publicerat \d{4}-\d{2}-\d{2}/).count()) > 0,
      );
      /* Ångra vägras när avtalet är ute — den publika datorn visar det redan. */
      /* Absent, not disabled: `disabledReason` is a title attribute, so a
         dashed control here would carry no visible reason at all. The panel
         below says PUBLICERAT, which is the reason, where a reader looks. */
      const reopen = page.getByRole("button", { name: /^Ångra klarmarkeringen$/ });
      check(
        "ångra erbjuds inte när avtalet är publicerat",
        (await reopen.count()) === 0,
      );
    }

    await asRole("public");
    await page.goto(BASE + "/allmanheten", { waitUntil: "networkidle" });
    const publicAfterMark = await rows().count();
    check(
      "avtalet handläggaren själv registrerade syns på allmänhetens dator",
      publicAfterMark === publicBeforeMark + 1,
      `${publicBeforeMark} → ${publicAfterMark}`,
    );
  }
}
await asRole("agreement-admin");

/* ── 5 · Register by hand, then match the protocol to that record ─────────
   §4.1 forbids the AI from registering a first-time agreement because there is
   nothing to match against. Once the officer has created it, there is — and
   that is what lets the walkthrough follow one agreement rather than three. */
console.log("\n5 · lägg upp avtalet för hand → matcha protokollet mot det");
await asRole("agreement-admin");
await page.goto(BASE + "/avtal/ny", { waitUntil: "networkidle" });
await page.fill("#na-name", "Stål- och metallindustrin tjänstemän");
await page.fill("#na-area", "Stål och metall");
/* The protocol is between Industriarbetsgivarna and Unionen, and no agreement in
   the register is: A-001 is the same industry's IF Metall agreement. So the
   salaried-staff agreement is the record this protocol is actually about. */
await page.selectOption("#na-ago", { label: "Industriarbetsgivarna" });
await page.selectOption("#na-ato", { label: "Unionen" });
for (const id of ["#na-type", "#na-sector"]) {
  const opts = await page.locator(`${id} option`).all();
  if (opts.length > 1) await page.selectOption(id, await opts[1].getAttribute("value"));
}
await page.getByRole("button", { name: /Spara avtalet/ }).click();
await page.waitForTimeout(700);

await page.goto(BASE + "/registrera", { waitUntil: "networkidle" });
await page.setInputFiles('input[type="file"]', {
  name: "Seko Kommunikation 2025-27.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.alloc(184320),
});
await page.waitForSelector("#steg-ai", { timeout: 20000 });
await page.waitForTimeout(600);

const picker = page.locator("#matched-agreement");
if ((await picker.count()) === 0) {
  unreachable("det egna avtalet går att matcha protokollet mot", "ingen avtalsväljare");
} else {
  const options = await page
    .locator("#matched-agreement option")
    .evaluateAll((os) => os.map((o) => [o.value, o.textContent.trim()]));
  const own = options.find(([value]) => value.startsWith("A-N"));
  check(
    "avtalet som lades upp för hand finns bland kandidaterna",
    Boolean(own),
    own ? own[1] : "(saknas)",
  );
  check(
    "AI:t föreslår, men väljer inte åt handläggaren",
    /Underlag för matchningen/.test(await page.locator("main").innerText()),
  );
  if (own) {
    await page.selectOption("#matched-agreement", own[0]);
    await page.waitForTimeout(300);
    const approveAi = page.getByRole("button", { name: /^Godkänn AI-förslagen$/ });
    if ((await approveAi.count()) === 0) {
      unreachable("flödet slutar på det valda avtalet", "godkännandet gick inte att nå");
    } else {
      await approveAi.click();
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: /Godkänn och koppla protokoll/ }).click();
      await page.waitForTimeout(700);
      const open = page.getByRole("link", { name: /Öppna avtalet/ });
      check(
        "flödet slutar på det avtal handläggaren valde",
        (await open.getAttribute("href")) === `/avtal/${own[0]}`,
        (await open.getAttribute("href")) ?? "(ingen)",
      );
    }
  }
}

/* ── 4 · Every report produces a document ──────────────────────────────── */
console.log("\n4 · varje rapport ger ett dokument");
await page.goto(BASE + "/rapporter", { waitUntil: "networkidle" });
const ids = await page.locator("#report-pick option").evaluateAll((os) => os.map((o) => o.value));
let documents = 0;
for (const id of ids) {
  await page.selectOption("#report-pick", id);
  await page.waitForTimeout(200);
  const ag = page.locator(`#${id}-agreement`);
  if ((await ag.count()) > 0) {
    const opts = await page.locator(`#${id}-agreement option`).all();
    if (opts.length > 1) await page.selectOption(`#${id}-agreement`, await opts[1].getAttribute("value"));
  }
  await page.getByRole("button", { name: /Generera rapport/ }).click();
  await page.waitForTimeout(400);
  const doc = page.locator("#rapportresultat.print-document");
  if ((await doc.count()) > 0 && (await doc.innerText()).length > 120) documents += 1;
}
check("alla rapporter ger ett dokument", documents === ids.length, `${documents}/${ids.length}`);

/*
  Two transitions are deliberately NOT here, and saying so is the point.

  **The Granska count falling** and **the last authorisation administrator being
  refused** both proved unreachable from this harness: the drawer's launcher and
  the register's role column would not resolve reliably enough to assert on, and
  a check that cannot find its target is a green that never ran — the fault this
  file exists to catch, one level up.

  Both are covered elsewhere and neither is unverified:

  - `mayDeactivate` has five unit tests in `lib/domain/user.test.ts`, including
    the last-active-administrator refusal and that an inactive one does not
    count as cover.
  - `useAiQueueReview` closes the approve-to-count loop, and both were walked by
    hand on 2026-08-24.

  They are in `docs/26-testworkflow.md` as manual steps 1.3 and 2.5. Padding this
  file with flaky versions of them would make the suite look broader and be
  worth less.
*/

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passerade`);
process.exit(failed.length === 0 ? 0 : 1);
