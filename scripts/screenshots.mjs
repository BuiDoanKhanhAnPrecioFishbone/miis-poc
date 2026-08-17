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
const SHOTS = [
  { name: "start-avtalsadministrator", path: "/", role: "agreement-admin" },
  { name: "start-medlingsadministrator", path: "/", role: "mediation-admin" },
  { name: "start-statistikanvandare", path: "/", role: "statistics-user" },
  { name: "registrera-protokoll", path: "/registrera", role: "agreement-admin" },
  {
    name: "registrera-protokoll-kallkoppling",
    path: "/registrera",
    role: "agreement-admin",
    fullPage: false,
    scrollTo: 900,
  },
  { name: "rapporter-konjunkturlonerapporten", path: "/rapporter", role: "agreement-admin" },
  { name: "sok-sokbyggaren", path: "/sok", role: "statistics-user" },
  { name: "medling-arendelista", path: "/medling", role: "mediation-admin" },
  { name: "medling-arende", path: "/medling/M-2027-12", role: "mediation-admin" },
  { name: "dokument", path: "/dokument", role: "agreement-admin" },
  { name: "allmanheten", path: "/allmanheten", role: "public" },
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

  const browser = await chromium.launch();
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
