/**
 * Screenshots for the tender document, taken from the running app.
 *
 * The tender and the live demo must not drift apart, so every image in the
 * document is generated from the same build the evaluators will click through —
 * never redrawn, never touched up.
 *
 * Each screen is captured twice: once as the product (requirement tags off,
 * which is what MI evaluates as a system) and once as the traceability document
 * (tags on, which is what the evaluators trace requirement → interface with).
 *
 *   npm run dev            # in one terminal
 *   npm run screenshots    # in another
 *
 * Add `--lang=en` for the English pass, `--width=768` for the tablet pass.
 */

import { Buffer } from "node:buffer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.MIIS_BASE_URL ?? "http://localhost:8080";
const OUT = path.resolve("screenshots");

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

/** 1440 is the width the tender document is laid out for. */
const WIDTH = Number(arg("width", "1440"));
const LANG = arg("lang", "sv");
const ROLE_DEFAULT = "agreement-admin";

/**
 * The screens the tender shows, with the role each one belongs to. The role is
 * part of the shot: the award criterion is role-based scenarios, so a screen
 * captured under the wrong persona shows the wrong menu.
 *
 * `fullPage` defaults to true. Set it false with a `scrollTo` where the point of
 * the screen is what happens *while* you scroll — /registrera pins the protocol
 * beside the form, and a full-page capture flattens that into a tall left-hand
 * gap rather than showing the behaviour it exists for.
 */

/**
 * US-01 step 1. `/registrera` opens on the upload, because that is where the
 * scenario opens, so every shot past it has to hand the page a file first —
 * the same PDF name the protocol pane has always carried, so the captures stay
 * comparable with the ones taken before the upload existed.
 */
async function uploadProtocol(page) {
  await page.setInputFiles('input[type="file"]', {
    name: "Seko Kommunikation 2025-27.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(184320),
  });
  // The pipeline runs four stages of 700 ms on its own; wait for the result.
  // By id, not by button label — this has to hold for the English pass too.
  await page.waitForSelector("#steg-ai", { timeout: 15000 });
  await page.waitForTimeout(150);
}

/**
 * The AI support, opened. §4.1 is the part of the offer a competitor is least
 * likely to have thought about, and it is behind a launcher — so a page capture
 * of any screen shows a violet pill and nothing else. The drawer has to be open
 * in at least one shot or the reader never sees it.
 */
async function openAiAssistant(page) {
  // The launcher is client-rendered, so wait for it rather than for the load
  // event — a shot taken on a screen with no upload step arrives before it.
  const launcher = page.locator("[data-ai-launcher]").first();
  await launcher.waitFor({ state: "visible", timeout: 15000 });
  await launcher.click();
  await page.waitForTimeout(250);
}

/**
 * Bilaga F's opening line — *"För varje rapport visas urvalsbild och resultat"* —
 * is the one sentence a report screenshot has to prove, and a capture of an
 * unrun selection screen proves half of it. So this shot runs the report.
 *
 * By id and by value rather than by label, so the English pass takes the same
 * shot; the button is found by its `#report-run` id for the same reason.
 */
async function runExpiryReport(page) {
  await page.selectOption("#report-pick", "utlopningstidpunkter");
  await page.click("#report-run");
  await page.waitForTimeout(400);
}

const SHOTS = [
  /*
    The address we send an evaluator to, so the pack should contain it. It is
    outside the `(miis)` group and carries no shell — the shot is evidence that
    the guide cannot be mistaken for MIIS functionality.
  */
  { name: "genomgang", path: "/genomgang", role: "agreement-admin" },
  { name: "start-avtalsadministrator", path: "/", role: "agreement-admin" },
  { name: "start-systemadministrator", path: "/", role: "system-admin" },
  { name: "start-medlingsadministrator", path: "/", role: "mediation-admin" },
  { name: "start-statistikanvandare", path: "/", role: "statistics-user" },
  { name: "registrera-uppladdning", path: "/registrera", role: "agreement-admin" },
  {
    name: "registrera-protokoll",
    path: "/registrera",
    role: "agreement-admin",
    prepare: uploadProtocol,
  },
  {
    name: "registrera-protokoll-kallkoppling",
    path: "/registrera",
    role: "agreement-admin",
    prepare: uploadProtocol,
    fullPage: false,
    scrollTo: 900,
  },
  { name: "avtalsregister", path: "/avtal", role: "agreement-admin" },
  /* §3.5's Scenario 2 opens on a wholly new agreement, which §4.1 says is the
     one registration the AI may not do. */
  { name: "avtal-nytt", path: "/avtal/ny", role: "agreement-admin" },
  { name: "avtal-huvudrapport", path: "/avtal/A-001", role: "agreement-admin" },
  { name: "market", path: "/market", role: "agreement-admin" },
  { name: "rapporter-urvalsbild", path: "/rapporter", role: "agreement-admin" },
  /*
    The mediator, deliberately. §3.1 gives the role *"Specifika rapporter"* and
    Bilaga 3 §5.1 names which three, so this shot carries two things at once:
    Bilaga F's urvalsbild-plus-result, and a picker holding exactly three
    reports with no menu behind it. Under the agreement administrator it would
    show ten, and the authorisation claim would be invisible.
  */
  {
    name: "rapport-utlopningstidpunkter",
    path: "/rapporter",
    role: "mediator",
    prepare: runExpiryReport,
  },
  /*
    §4.1's third function is the one text input the requirement asks for, and it
    is the screenshot that answers "does the AI have a box you can type into".
  */
  {
    name: "ai-fritextsokning",
    path: "/registrera",
    role: "agreement-admin",
    prepare: async (page) => {
      await uploadProtocol(page);
      await page.click("#clause-term");
      await page.getByRole("button", { name: /^deltidspension$/ }).click();
      await page.waitForTimeout(300);
    },
    fullPage: false,
    scrollTo: 1600,
  },
  /*
    The assistant answering a question. The drawer's other shot is taken on
    /registrera where three functions run; this one is taken where none does,
    because that is where "ask MIIS a question" is the whole of what it offers.
  */
  {
    name: "ai-fraga",
    path: "/rapporter",
    role: "agreement-admin",
    prepare: async (page) => {
      await openAiAssistant(page);
      await page.fill("#ai-question", "Vilka registreringar är ofullständiga?");
      await page.locator(".fixed.inset-0").getByRole("button", { name: /^Fråga$|^Ask$/ }).click();
      await page.waitForTimeout(300);
    },
    fullPage: false,
  },
  {
    name: "ai-assistenten",
    path: "/registrera",
    role: "agreement-admin",
    prepare: async (page) => {
      await uploadProtocol(page);
      await openAiAssistant(page);
    },
    fullPage: false,
  },
  { name: "sok-sokbyggaren", path: "/sok", role: "statistics-user" },
  { name: "partstraffar", path: "/partstraffar", role: "mediation-admin" },
  { name: "partstraffar-ny", path: "/partstraffar/ny", role: "mediation-admin" },
  { name: "partstraff", path: "/partstraffar/PT-2027-04", role: "mediation-admin" },
  { name: "medling-arendelista", path: "/medling", role: "mediation-admin" },
  { name: "medling-arende", path: "/medling/M-2027-12", role: "mediation-admin" },
  { name: "parter", path: "/parter", role: "agreement-admin" },
  { name: "part-ny", path: "/parter/ny", role: "agreement-admin" },
  { name: "part-namnbyte", path: "/parter/P-028", role: "agreement-admin" },
  { name: "dokument", path: "/dokument", role: "agreement-admin" },
  { name: "allmanheten", path: "/allmanheten", role: "public" },
  /*
    Bilaga 2 §3.5's Scenario 3 ends on *"tar del av information om avtalet"* and
    *"öppnar och laddar ned avtal"*, and neither had a screen until this page.
    It is Bilaga F's Rapport 1 — the release, not the working record.
  */
  { name: "allmanheten-avtal", path: "/allmanheten/A-013", role: "public" },
  { name: "administration-loggar", path: "/administration", role: "system-admin" },
  { name: "anvandare-behorigheter", path: "/administration/anvandare", role: "permission-admin" },
];

const { hostname } = new URL(BASE);

const cookie = (name, value) => ({
  name,
  value,
  domain: hostname,
  path: "/",
  sameSite: "Lax",
});

async function main() {
  await mkdir(OUT, { recursive: true });

  // `--lang` sets the browser UI locale, which is what native <input type="date">
  // formats against. The context `locale` below only sets Accept-Language and
  // navigator.language, so without this the date fields render as MM/DD/YYYY in
  // a Swedish screenshot — every other date in the app is ISO.
  const browser = await chromium.launch({
    args: [`--lang=${LANG === "en" ? "en-GB" : "sv-SE"}`],
  });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: 1200 },
    deviceScaleFactor: 2,
    locale: LANG === "en" ? "en-GB" : "sv-SE",
    // The recording is of a screen, not of an animation.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  let failures = 0;

  for (const shot of SHOTS) {
    for (const reqTags of ["off", "on"]) {
      await context.clearCookies();
      await context.addCookies([
        cookie("miis_role", shot.role ?? ROLE_DEFAULT),
        cookie("miis_dataset", "normal"),
        cookie("miis_lang", LANG),
        cookie("miis_reqtags", reqTags),
      ]);

      const url = `${BASE}${shot.path}`;
      const response = await page.goto(url, { waitUntil: "networkidle" });
      if (!response || !response.ok()) {
        console.error(`  FAIL ${shot.name} (${reqTags}) — ${response?.status() ?? "no response"}`);
        failures += 1;
        continue;
      }

      /*
        The AI launcher is `position: fixed`, so a full-page capture paints it
        wherever the viewport happened to be — over a table, halfway down a
        report — and in a tender document that reads as a defect rather than as
        a control. It stays only in the shot whose subject it is.
      */
      if (!["ai-assistenten", "ai-fraga"].includes(shot.name)) {
        await page.addStyleTag({ content: "[data-ai-launcher]{display:none !important}" });
      }

      if (shot.prepare) await shot.prepare(page);

      if (shot.scrollTo) {
        await page.evaluate((y) => window.scrollTo(0, y), shot.scrollTo);
        await page.waitForTimeout(150);
      }

      const suffix = [LANG, WIDTH, reqTags === "on" ? "kravid" : "produkt"].join("-");
      const file = path.join(OUT, `${shot.name}--${suffix}.png`);
      await page.screenshot({ path: file, fullPage: shot.fullPage !== false });
      console.log(`  ${path.relative(process.cwd(), file)}`);
    }
  }

  await browser.close();

  if (failures > 0) {
    console.error(`\n${failures} screenshot(s) failed. Is \`npm run dev\` running on ${BASE}?`);
    process.exit(1);
  }
  console.log(`\n${SHOTS.length * 2} screenshots written to ${path.relative(process.cwd(), OUT)}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
