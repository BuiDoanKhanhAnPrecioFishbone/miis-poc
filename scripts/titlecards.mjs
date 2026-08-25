/**
 * Title cards for the recorded walkthrough.
 *
 * A demo film of a register is a lot of screens that look alike. Without
 * something between them a viewer loses the thread by minute four, and the
 * thread is the whole reason to film a *scenario* instead of taking
 * screenshots. So each scene gets a card: the film's storyline in one frame,
 * held long enough to read and no longer.
 *
 * **Generated rather than typed into an editor.** A card set in the editor's
 * default typeface, in whatever grey the editor defaults to, is the one part of
 * the film that is not Medlingsinstitutet's design — and it is the part that
 * appears twelve times. These use the same tokens and the same self-hosted
 * Public Sans as the system, so the cards and the screens are visibly one
 * thing.
 *
 * The scene list comes from `docs/30-demomanus-video-SV.md`, so the cards
 * cannot name a scene the script does not have.
 *
 *   npm run titlecards
 *
 * Output: `export/titelkort/NN-slug.png`, 1920 × 1080, ready to drop in.
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const SCRIPT = path.resolve("docs/30-demomanus-video-SV.md");
const OUT = path.resolve("export/titelkort");
const WIDTH = 1920;
const HEIGHT = 1080;

/* MI's own tokens, read from the stylesheet so a palette change reaches the
   cards too — a hard-coded hex here is the thing that goes stale silently. */
const css = await readFile(path.resolve("app/globals.css"), "utf8");
const token = (name, fallback) =>
  css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{3,8})`))?.[1] ?? fallback;

const INK = token("mi-slate-900", "#314852");
const PAPER = token("mi-paper", "#F7F5F0");
const SAND = token("mi-sand-500", "#CBB184");

const script = await readFile(SCRIPT, "utf8");

/**
 * The scenes, in order, from the script itself.
 *
 * Two lines per card: the number, and the scene's own name. Where the name
 * carries a dash — *"Första stoppet — vilket avtal gäller det?"* — the halves
 * split across two lines, because a title that wraps wherever the box happens
 * to end reads as an accident.
 */
const scenes = [...script.matchAll(/^## Scen (\d+) · (.+?) — \d+:\d+–\d+:\d+$/gm)].map(
  ([, n, title]) => ({ n: Number(n), title: title.trim() }),
);
if (scenes.length === 0) throw new Error("hittade inga scener i demomanuset");

/** The film's own title, from the script's storyline. */
const OPENING = {
  n: 0,
  title: "Registrera, uppdatera och publicera ett kollektivavtal",
  kicker: "MIIS · Avtalsadministratörens arbete",
  lead: "Från protokollet på skrivbordet till datorn i Medlingsinstitutets lokaler",
};

const CLOSING = {
  n: scenes.length + 1,
  title: "Allt ni sett är det körande systemet",
  kicker: "MIIS",
  lead: "miis-poc.vercel.app",
};

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

/**
 * One card.
 *
 * Centred, because a card has one job and nothing to align to. The sand rule
 * under the kicker is the only ornament — it is the same mark the start page
 * uses for a reference, and it gives the eye something to land on while the
 * title is being read.
 */
function html({ kicker, title, lead }, fonts) {
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8">
<style>
  @font-face {
    font-family: "Public Sans";
    src: url("data:font/woff2;base64,${fonts.latin}") format("woff2");
    font-weight: 100 900;
    font-display: block;
  }
  @font-face {
    font-family: "Public Sans";
    src: url("data:font/woff2;base64,${fonts.ext}") format("woff2");
    font-weight: 100 900;
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB;
    font-display: block;
  }
  html, body { margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: ${PAPER};
    font-family: "Public Sans", Arial, sans-serif;
    color: ${INK};
    display: flex; align-items: center; justify-content: center;
  }
  .card { width: 1340px; text-align: center; }
  .kicker {
    font-size: 30px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${INK}; opacity: 1;
  }
  .rule {
    width: 96px; height: 6px; background: ${SAND};
    margin: 34px auto 40px; border-radius: 3px;
  }
  h1 {
    margin: 0; font-size: 84px; line-height: 1.12; font-weight: 600;
    letter-spacing: -0.015em;
  }
  .lead {
    margin-top: 36px; font-size: 34px; line-height: 1.4; font-weight: 400;
    color: ${INK};
  }
</style></head><body>
  <div class="card">
    ${kicker ? `<p class="kicker">${kicker}</p><div class="rule"></div>` : ""}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>
</body></html>`;
}

const fonts = {
  latin: (await readFile(path.resolve("app/fonts/public-sans-latin.woff2"))).toString("base64"),
  ext: (await readFile(path.resolve("app/fonts/public-sans-latin-ext.woff2"))).toString("base64"),
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

const cards = [
  OPENING,
  ...scenes.map((s) => ({
    n: s.n,
    kicker: `Scen ${s.n}`,
    /* A title built around a dash splits on it; the halves are a heading and
       its qualifier, and letting the box decide where to wrap reads as an
       accident. */
    title: s.title.replace(/\s+—\s+/, "<br>"),
  })),
  CLOSING,
];

const listed = [];
for (const card of cards) {
  const name = `${String(card.n).padStart(2, "0")}-${slug(
    card.title.replace(/<br>/g, " "),
  )}.png`;
  await page.setContent(html(card, fonts), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, name) });
  listed.push(`${name}  ${card.title.replace(/<br>/g, " — ")}`);
  console.log(`  ${name}`);
}

/* A card the editor cannot place is a card that does not get used. */
await writeFile(
  path.join(OUT, "LÄSMIG.txt"),
  [
    "Titelkort till den inspelade genomgången",
    "========================================",
    "",
    "1920 × 1080, samma typsnitt och färger som systemet.",
    "",
    "Läggs in före respektive scen. 2 sekunder per scenkort, 4 sekunder på",
    "öppningen och avslutet. Ingen animering — ett hårt klipp in och ut.",
    "Ljudet fortsätter inte under korten; de är pauser, inte överlägg.",
    "",
    "Genererade av `npm run titlecards` ur docs/30-demomanus-video-SV.md.",
    "Ändra scenens namn i manuset och kör om — korten följer med.",
    "",
    ...listed,
    "",
  ].join("\n"),
  "utf8",
);

await browser.close();
console.log(`\n${cards.length} titelkort → ${path.relative(process.cwd(), OUT)}/`);
