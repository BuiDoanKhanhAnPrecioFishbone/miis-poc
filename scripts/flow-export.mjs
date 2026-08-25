/**
 * The flow document as .docx and .pdf, in both languages, for review off-screen.
 *
 * `flows.mjs` produces Markdown, which is right for the repository and useless
 * for the person who has to read 22 screens and say whether they are correct.
 * This turns the same generated Markdown into the two formats a reviewer
 * actually opens — so the source of truth is still
 * `lib/domain/walkthrough.ts`, one step further along.
 *
 * **AI is highlighted, and it is the one thing highlighted.** The prototype
 * marks machine-generated content with four signals — the violet, the banded
 * header, the spine and the `AI` letter-mark — because any one of them can be
 * lost to greyscale or a projector. A document has none of that chrome, so it
 * carries the two that survive: the violet, and the word. Which steps are marked
 * comes from `lib/domain/walkthrough.ts`, where each step says whether an AI
 * function runs on it — not from this file's reading of the text. Nothing else
 * is highlighted, for the same reason the screen tints nothing else: a
 * highlight that marks two things marks neither.
 *
 *   npm run dev              # in one terminal
 *   npm run flows            # generates the Swedish document + images
 *   npm run flows -- --lang=en
 *   npm run flow-export      # then this, for both languages
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";

const OUT = path.resolve("export");

/** The AI violet, from `app/globals.css`. Hex, because neither format has tokens. */
const AI = "7B3FCC";
const AI_TINT = "F3EDFC";
const INK = "1E2A32";
const MUTED = "5A6B75";

const PASSES = [
  {
    lang: "sv",
    doc: "docs/29-flodesbilder-SV.md",
    images: "screenshots/flode",
    base: "MIIS-flodesbilder-SV",
    aiLabel: "AI-STÖD",
    aiNote:
      "Markerade avsnitt innehåller AI-stöd. Varje AI-förslag granskas och godkänns av en handläggare innan något sparas.",
  },
  {
    lang: "en",
    doc: "docs/29-flow-images.md",
    images: "screenshots/flow-en",
    base: "MIIS-flow-images-EN",
    aiLabel: "AI SUPPORT",
    aiNote:
      "Marked sections involve AI support. Every AI proposal is reviewed and approved by a case officer before anything is saved.",
  },
];

/**
 * The marker `flows.mjs` writes on a step where an AI function runs.
 *
 * Read rather than inferred. The first version asked whether the step cited an
 * `FAI-*` rule, which marked *step 1* — the step whose whole point is that §4.1
 * forbids the AI there. Explaining a prohibition means citing the rule that
 * imposes it, so a citation cannot tell the two apart. The walkthrough says it
 * outright now, and `walkthrough.test.ts` holds the claim to `aiFunctionsForPath`.
 */
const AI_MARKER = /\s*\[(AI-stöd|AI support)\]\s*$/;

function aiHeading(text) {
  return AI_MARKER.test(text);
}

/* -------------------------------------------------------------------------- */
/* Parse the generated Markdown back into blocks                              */
/* -------------------------------------------------------------------------- */

/**
 * A deliberately small parser for a file we generate ourselves.
 *
 * It handles exactly the shapes `flows.mjs` emits — four heading levels, an
 * image, a `<small>` requirement line, a rule and paragraphs — and nothing
 * else. A general Markdown library would be more code and no more correct,
 * because the only input is our own output.
 */
function parse(md) {
  const blocks = [];
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line === "---") {
      blocks.push({ kind: "rule" });
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const text = heading[2];
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: text.replace(AI_MARKER, ""),
        ...(aiHeading(text) ? { aiHeading: true } : {}),
      });
      continue;
    }
    const image = /^!\[(.*)\]\((.+)\)$/.exec(line);
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      continue;
    }
    const small = /^<small>(.*)<\/small>$/.exec(line);
    if (small) {
      blocks.push({ kind: "meta", text: small[1] });
      continue;
    }
    blocks.push({ kind: "para", text: line });
  }
  return blocks;
}

/** Strip the inline Markdown the generated file uses: **bold**, *italic*, `code`. */
function plain(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}

/**
 * Walk the blocks and mark each step section as AI or not.
 *
 * A step opens at `#### n. Label` and its requirement line arrives several
 * blocks later, so the flag is resolved by looking ahead to the next `meta`
 * before the following heading — the document says which rules a step answers
 * after showing it, and the highlight has to be decided before.
 */
function markAi(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind !== "heading" || b.level !== 4) continue;
    const ai = Boolean(b.aiHeading);
    for (let j = i; j < blocks.length; j++) {
      if (j > i && blocks[j].kind === "heading") break;
      blocks[j].ai = ai;
    }
  }
  return blocks;
}

/* -------------------------------------------------------------------------- */
/* HTML → PDF                                                                 */
/* -------------------------------------------------------------------------- */

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function html(blocks, pass, imagesAbs) {
  const body = blocks
    .map((b) => {
      const cls = b.ai ? ' class="ai"' : "";
      switch (b.kind) {
        case "rule":
          return "<hr>";
        case "heading":
          return `<h${b.level}${cls}>${esc(plain(b.text))}</h${b.level}>`;
        case "image":
          return `<figure${cls}><img src="file:///${imagesAbs.replace(/\\/g, "/")}/${path.basename(
            b.src,
          )}" alt="${esc(b.alt)}"></figure>`;
        case "meta":
          return `<p class="meta${b.ai ? " ai" : ""}">${esc(plain(b.text))}</p>`;
        default:
          return `<p${cls}>${esc(plain(b.text))}</p>`;
      }
    })
    .join("\n");

  return `<!doctype html><html lang="${pass.lang}"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: "Public Sans", Arial, sans-serif; color: #${INK};
         font-size: 10.5pt; line-height: 1.5; }
  h1 { font-size: 20pt; margin: 0 0 12pt; }
  h2 { font-size: 15pt; margin: 22pt 0 6pt; page-break-before: always; }
  h1 + p + p + p + hr + h2 { page-break-before: avoid; }
  h3 { font-size: 12pt; margin: 14pt 0 4pt; }
  h4 { font-size: 11pt; margin: 14pt 0 4pt; page-break-after: avoid; }
  p { margin: 0 0 7pt; }
  .meta { color: #${MUTED}; font-size: 8.5pt; }
  hr { border: 0; border-top: 1px solid #d9dfe3; margin: 16pt 0; }
  figure { margin: 6pt 0 10pt; page-break-inside: avoid; }
  img { max-width: 100%; border: 1px solid #d9dfe3; }
  /* The two AI signals a printed page keeps: the violet, and the word. */
  h4.ai { border-left: 4pt solid #${AI}; padding-left: 8pt; }
  h4.ai::after { content: " · ${pass.aiLabel}"; color: #${AI};
                 font-size: 8pt; letter-spacing: .08em; }
  p.ai, figure.ai { border-left: 4pt solid #${AI}; padding-left: 8pt;
                    background: #${AI_TINT}; }
  p.meta.ai { color: #${AI}; }
</style></head><body>
${body}
</body></html>`;
}

/* -------------------------------------------------------------------------- */
/* DOCX                                                                       */
/* -------------------------------------------------------------------------- */

const HEADING = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
};

/** The violet bar, as a left border — Word's nearest thing to the screen's spine. */
const AI_BORDER = {
  left: { style: BorderStyle.SINGLE, size: 18, color: AI, space: 8 },
};
const AI_SHADING = { type: ShadingType.CLEAR, fill: AI_TINT, color: "auto" };

async function docxFor(blocks, pass, imagesAbs) {
  const children = [];
  for (const b of blocks) {
    const ai = Boolean(b.ai);
    switch (b.kind) {
      case "rule":
        children.push(
          new Paragraph({
            text: "",
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D9DFE3" } },
          }),
        );
        break;
      case "heading":
        children.push(
          new Paragraph({
            heading: HEADING[b.level],
            ...(ai && b.level === 4 ? { border: AI_BORDER } : {}),
            children: [
              new TextRun({ text: plain(b.text), bold: true }),
              ...(ai && b.level === 4
                ? [new TextRun({ text: `  ·  ${pass.aiLabel}`, color: AI, size: 16, bold: true })]
                : []),
            ],
          }),
        );
        break;
      case "image": {
        const file = path.join(imagesAbs, path.basename(b.src));
        const data = await readFile(file);
        /* A4 text column is ~178mm; the captures are 1440 CSS px at 2x. Fixed
           height keeps the aspect ratio of the source rather than guessing. */
        const width = 470;
        const height = Math.round((width * 3) / 4);
        children.push(
          new Paragraph({
            ...(ai ? { border: AI_BORDER, shading: AI_SHADING } : {}),
            children: [
              new ImageRun({ data, type: "png", transformation: { width, height } }),
            ],
          }),
        );
        break;
      }
      case "meta":
        children.push(
          new Paragraph({
            ...(ai ? { border: AI_BORDER } : {}),
            children: [
              new TextRun({ text: plain(b.text), size: 16, color: ai ? AI : MUTED }),
            ],
          }),
        );
        break;
      default:
        children.push(
          new Paragraph({
            ...(ai ? { border: AI_BORDER, shading: AI_SHADING } : {}),
            children: [new TextRun({ text: plain(b.text), color: INK })],
          }),
        );
    }
  }

  /* The note that says what the highlight means, right after the title. */
  const legendAt = children.findIndex((_, i) => i === 1);
  children.splice(
    legendAt,
    0,
    new Paragraph({
      border: AI_BORDER,
      shading: AI_SHADING,
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: `${pass.aiLabel}  `, bold: true, color: AI, size: 18 }),
        new TextRun({ text: pass.aiNote, color: INK, size: 18 }),
      ],
    }),
  );

  return new Document({ sections: [{ children }] });
}

/* -------------------------------------------------------------------------- */

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const pass of PASSES) {
  const md = await readFile(path.resolve(pass.doc), "utf8");
  const imagesAbs = path.resolve(pass.images);
  const blocks = markAi(parse(md));
  const aiSteps = blocks.filter((b) => b.kind === "heading" && b.level === 4 && b.ai).length;

  /*
    PDF, through the same engine the app prints with.

    Via a file on disk rather than `setContent`: that gives the page an
    `about:blank` origin, from which every `file://` screenshot is cross-origin
    and silently blocked — a blocked image raises no page error, so the first
    run produced an 82 kB PDF of captions with no pictures in it. The HTML is
    kept rather than cleaned up; it is the exact input the PDF was made from.
  */
  const htmlPath = path.join(OUT, `${pass.base}.html`);
  await writeFile(htmlPath, html(blocks, pass, imagesAbs), "utf8");
  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  /* Assert rather than hope: a screenshot that failed to load is invisible in
     the output and the whole document is pictures. */
  const broken = await page.evaluate(
    () => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
  );
  if (broken > 0) throw new Error(`${broken} bilder kunde inte laddas i ${pass.base}`);
  const pdfPath = path.join(OUT, `${pass.base}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
  await page.close();

  /* DOCX. */
  const doc = await docxFor(blocks, pass, imagesAbs);
  const docxPath = path.join(OUT, `${pass.base}.docx`);
  await writeFile(docxPath, await Packer.toBuffer(doc));

  console.log(`${pass.lang}  ${aiSteps} AI-marked steps`);
  console.log(`    ${path.relative(process.cwd(), pdfPath)}`);
  console.log(`    ${path.relative(process.cwd(), docxPath)}`);
}

await browser.close();
