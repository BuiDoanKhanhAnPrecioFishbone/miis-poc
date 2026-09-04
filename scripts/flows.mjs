/**
 * Flödesbilder — the main flow of every scenario, captured and written up.
 *
 * `screenshots.mjs` captures **screens**: one shot per view, for the places the
 * response points at. This captures **flows**: the steps of a scenario in the
 * order an officer performs them, so a reader who has never seen MIIS can
 * follow the work rather than inspect the furniture.
 *
 * Two things make it worth having its own script rather than more entries in
 * the shot list:
 *
 *   1. **The demo strip is hidden.** The flödesbilder are of MIIS, and the
 *      strip is deliberately not part of MIIS (CLAUDE.md). A role switcher
 *      above a screen is right in a live walkthrough and wrong in a document
 *      that says *this is the system*.
 *   2. **The document is generated with the images.** `lib/domain/walkthrough.ts`
 *      already holds every scenario, every step, the Swedish label and the
 *      sentence explaining what to look at — and a test asserts no step sends a
 *      role to a screen it would be refused. Writing the prose by hand would
 *      create a second copy that goes stale silently, which is the failure
 *      `docs/20-handover.md` records as the thing to do differently next time.
 *
 * So the flow, the captions and the pictures all come from one source. Change a
 * step in the walkthrough and this document changes with it.
 *
 *   npm run dev     # in one terminal
 *   npm run flows   # in another
 *
 * Swedish only, deliberately: `docs/18-role-scenarios-SV.md` is what is
 * submitted and this is its visual half.
 */

import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

/* Node 24 strips types on import, and `lib/domain/` imports nothing but types —
   which is exactly what rule 1 of the four structural rules buys us here. */
import { WALKTHROUGH, totalSteps } from "../lib/domain/walkthrough.ts";

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const BASE = process.env.MIIS_BASE_URL ?? "http://localhost:8080";
const LANG = arg("lang", "sv") === "en" ? "en" : "sv";
const WIDTH = 1440;

/* Swedish is what is submitted and keeps the `-SV` suffix the other two
   response documents use; English is the second translation the internal team
   and a non-Swedish reviewer read. The images are captured per language too —
   an English caption over a Swedish screen is worse than no caption. */
const LOCALE = LANG === "en" ? "en-GB" : "sv-SE";
const OUT = path.resolve(LANG === "en" ? "screenshots/flow-en" : "screenshots/flode");
const DOC = path.resolve(
  LANG === "en" ? "docs/29-flow-images.md" : "docs/29-flodesbilder-SV.md",
);
const IMG_DIR = LANG === "en" ? "flow-en" : "flode";

/** `/registrera` opens on an empty drop zone; every step past it needs a file. */
async function uploadProtocol(page) {
  const input = page.locator('input[type="file"]');
  if ((await input.count()) === 0) return;
  await input.setInputFiles({
    name: "Seko Kommunikation 2025-27.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(184320),
  });
  /* By id, not by label: the pipeline runs four stages of 700 ms of its own. */
  await page.waitForSelector("#steg-ai", { timeout: 20000 });
  await page.waitForTimeout(400);
}

/**
 * Type a sentence and interpret it, so the shot shows a proposal.
 *
 * An empty composer is a picture of a text box; what the step is about is the
 * proposal — the criteria, the words each was read from, and the line naming
 * what could not be placed. Same reason the protocol is uploaded before
 * `/registrera` is captured.
 */
function askAssistant(sv, en) {
  return async (page) => {
    const field = page.locator("#nl-intent");
    if ((await field.count()) === 0) return;
    await field.fill(LANG === "en" ? en : sv);
    await page.getByRole("button", { name: LANG === "en" ? /^Interpret$/ : /^Tolka$/ }).click();
    await page.waitForTimeout(400);
  };
}

const PREPARE = {
  "/registrera": uploadProtocol,
  "/sok": askAssistant(
    "avtal inom privat sektor som gällde 2027 hos Teknikföretagen",
    "agreements in the private sector valid in 2027 at Teknikföretagen",
  ),
  "/rapporter": askAssistant(
    "vilka avtal löper ut 2027",
    "which agreements expire in 2027",
  ),
};

const cookie = (name, value) => ({ name, value, domain: "localhost", path: "/" });

/**
 * The roles' own Swedish names, read off the running build.
 *
 * `roleInfo` lives in `lib/domain/role.ts`, which Node cannot import the way it
 * imports the walkthrough: the walkthrough's imports are types and get stripped,
 * role's are values with extensionless specifiers. Writing the eight labels out
 * here would be a second copy of MI's own §3.1 role names, and the whole point
 * of generating this document is that there is one copy of everything. So they
 * come from the demo strip's own role picker, which renders `roleInfo`.
 */
async function roleLabels(browser) {
  const ctx = await browser.newContext({ locale: LOCALE });
  /* With the language cookie, or the picker answers in the app's default and
     the English document comes out naming Swedish roles. */
  await ctx.addCookies([cookie("miis_lang", LANG), cookie("miis_dataset", "normal")]);
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const pairs = await page.locator("#demo-role option").evaluateAll((os) =>
    os.map((o) => [o.value, o.textContent.trim()]),
  );
  await ctx.close();
  if (pairs.length === 0) throw new Error("hittade inga roller i demoradens väljare");
  return Object.fromEntries(pairs);
}

/** `Å` and `ä` are not filename material on every machine the pack travels to. */
function slug(text) {
  return text
    .toLowerCase()
    .replace(/[åäà]/g, "a")
    .replace(/[öø]/g, "o")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

await mkdir(OUT, { recursive: true });
/* `--lang` sets the browser UI locale, which is what a native
   `<input type="date">` formats against — without it the public search renders
   `mm/dd/yyyy` on a Swedish authority's screen. The context `locale` below only
   reaches Accept-Language and navigator.language. Same note as
   `screenshots.mjs`, same trap. */
const browser = await chromium.launch({ args: [`--lang=${LANG === "en" ? "en-GB" : "sv-SE"}`] });
const ROLE = await roleLabels(browser);
const lines = [];
let shots = 0;

/** The document's own prose. The steps' prose comes from the walkthrough. */
const DOC_COPY = {
  sv: {
    title: "Så arbetar man i MIIS — sex scenarier, steg för steg",
    lead:
      "Det här dokumentet visar **hur systemet fungerar och skälen bakom det som är byggt**. Varje avsnitt är ett scenario: en roll, en arbetsuppgift, och de skärmar uppgiften går igenom i tur och ordning. Under varje bild står vad man ser och varför det är gjort så — inte vad knapparna heter, utan vilket problem lösningen svarar mot.",
    tryIt:
      "**Systemet bakom bilderna är ett körande bygge.** En klickbar demonstration av samma sex scenarier ges vid den muntliga presentationen.",
    count: (n, steps) =>
      `**${n} scenarier, ${steps} steg.** De tre första är de roller som avropsförfrågan bedömer och ligger därför först. De tre sista är med för att visa att systemet är helt — de ingår inte i det bedömda svaret, men de är byggda och ingår i demonstrationen.`,
    stripped:
      "**Den grå demoraden är bortklippt ur bilderna.** Rollväxlaren, språkvalet och kravnumren är hjälpmedel för granskningen och ingår inte i MIIS — de hör inte hemma i ett dokument som visar hur systemet ser ut i drift. Rollen står i stället i texten vid varje steg.",
    aiNote:
      "**Där AI-stödet är inblandat är steget märkt.** Ingenting AI:t föreslår sparas av sig självt: varje förslag granskas och godkänns av en handläggare, och helt nya avtal registreras alltid för hand. Ett eget steg visar AI-panelen i sin helhet.",
    provenance:
      "*Varje bild i dokumentet är tagen automatiskt ur det körande systemet. Dokumentet kan därför inte beskriva något som inte finns i bygget.*",
    scored: "Bedöms i avropet",
    supporting: "Visas som komplement",
    role: "Roll",
    steps: "steg",
    taskAndGoal: "Vad rollen ska uträtta",
    workflow: "Så går arbetet till",
    usability: "Användbarhet, effektivitet och tillgänglighet",
    requirements: "Krav som steget svarar mot",
    tryStep: (role) => `*Utförs som **${role}**.*`,
    ai: "AI-stöd",
  },
  en: {
    title: "How MIIS is worked in — six scenarios, step by step",
    lead:
      "This document shows **how the system works and the reasoning behind what has been built**. Each section is one scenario: a role, a task, and the screens that task goes through in order. Under every image is what you are looking at and why it is built that way — not what the buttons are called, but which problem the solution answers.",
    tryIt:
      "**The system behind the images is a running build.** A clickable demonstration of the same six scenarios is given at the oral presentation.",
    count: (n, steps) =>
      `**${n} scenarios, ${steps} steps.** The first three are the roles the call-off assesses and come first for that reason. The last three are here to show the system is complete — they are not part of the assessed response, but they are built and are included in the demonstration.`,
    stripped:
      "**The grey demo strip is cropped out of the images.** The role switcher, the language choice and the requirement numbers are aids for the review and are not part of MIIS — they do not belong in a document showing how the system looks in use. The role is named in the text at each step instead.",
    aiNote:
      "**Where the AI support is involved, the step is marked.** Nothing the AI proposes is saved by itself: every proposal is reviewed and approved by a case officer, and wholly new agreements are always registered by hand. A step of its own shows the AI panel in full.",
    provenance:
      "*Every image in this document is captured automatically from the running system. The document therefore cannot describe anything that is not in the build.*",
    scored: "Assessed in the call-off",
    supporting: "Shown as supporting evidence",
    role: "Role",
    steps: "steps",
    taskAndGoal: "What the role has to get done",
    workflow: "How the work goes",
    usability: "Usability, efficiency and accessibility",
    requirements: "Requirements this step answers",
    tryStep: (role) => `*Performed as **${role}**.*`,
    ai: "AI support",
  },
}[LANG];

lines.push(
  `# ${DOC_COPY.title}`,
  "",
  DOC_COPY.lead,
  "",
  DOC_COPY.tryIt,
  "",
  DOC_COPY.count(WALKTHROUGH.length, totalSteps()),
  "",
  DOC_COPY.stripped,
  "",
  DOC_COPY.aiNote,
  "",
  DOC_COPY.provenance,
  "",
  "---",
  "",
);

for (const scenario of WALKTHROUGH) {
  const heading = scenario.scored ? DOC_COPY.scored : DOC_COPY.supporting;
  lines.push(
    `## ${scenario.title[LANG]}`,
    "",
    `**${heading}** · ${DOC_COPY.role}: ${ROLE[scenario.role]} · ${scenario.steps.length} ${DOC_COPY.steps}`,
    "",
    `### ${DOC_COPY.taskAndGoal}`,
    "",
    scenario.taskAndGoal[LANG],
    "",
    `### ${DOC_COPY.workflow}`,
    "",
  );

  for (const [i, step] of scenario.steps.entries()) {
    const n = i + 1;
    const name = `${scenario.id}-${String(n).padStart(2, "0")}-${slug(step.label[LANG])}`;
    const file = `${name}.png`;

    const ctx = await browser.newContext({
      viewport: { width: WIDTH, height: step.drawer ? 1000 : 900 },
      /* Printed at 1x, 13px body text is soft. */
      deviceScaleFactor: 2,
      locale: LOCALE,
      /* The image is of a screen, not of an animation. */
      reducedMotion: "reduce",
    });
    await ctx.addCookies([
      cookie("miis_role", step.role),
      cookie("miis_dataset", "normal"),
      cookie("miis_lang", LANG),
      cookie("miis_reqtags", "off"),
    ]);
    const page = await ctx.newPage();
    await page.goto(BASE + step.href, { waitUntil: "networkidle" });
    /* The strip is chrome for the reviewer, not part of the system. Hidden in
       the page rather than cropped, so the screen below it lays out at its own
       full height instead of being pushed down and clipped. */
    await page.addStyleTag({ content: "[data-demo-bar]{display:none!important}" });
    await PREPARE[step.href]?.(page);
    /* The panel is a drawer behind a launcher, so a shot of the route alone
       shows the screen in front of it rather than the thing the step is about. */
    if (step.drawer) {
      const launcher = page.getByRole("button", { name: /AI-stöd|AI support/ });
      if (await launcher.count()) {
        await launcher.first().click();
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(OUT, file),
      /* A fixed drawer is not part of the scrolling document — full-page it
         becomes a strip at the top of a very tall image. */
      fullPage: !step.drawer,
    });
    await ctx.close();
    shots += 1;
    console.log(`  ${file}`);

    lines.push(
      `#### ${n}. ${step.label[LANG]}${step.ai ? ` [${DOC_COPY.ai}]` : ""}`,
      "",
      DOC_COPY.tryStep(ROLE[step.role]),
      "",
      step.detail[LANG],
      "",
      `![${step.label[LANG]}](../screenshots/${IMG_DIR}/${file})`,
      "",
      `<small>${DOC_COPY.requirements}: ${step.requirements.join(", ")}</small>`,
      "",
    );
  }

  lines.push(
    `### ${DOC_COPY.usability}`,
    "",
    scenario.usability[LANG],
    "",
    "---",
    "",
  );
}

await browser.close();
await writeFile(DOC, lines.join("\n"), "utf8");
console.log(`\n${shots} flödesbilder → ${path.relative(process.cwd(), OUT)}/`);
console.log(`dokument → ${path.relative(process.cwd(), DOC)}`);
