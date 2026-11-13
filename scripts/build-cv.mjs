// Builds the CV PDFs from cv/source:
// - public/cv: the designed one-page CVs (template.ts), served by the site;
// - cv/ats (gitignored, private): plain ATS versions of the same content (template-ats.ts), for job portals.
// Usage: npm run cv:build   (Node 22.18+ strips the TypeScript types natively)
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { cvVariants } from "../cv/source/content.ts";
import { renderCv, cvFileName } from "../cv/source/template.ts";
import { renderCvAts } from "../cv/source/template-ats.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = `${root}public/cv`;
const atsDir = `${root}cv/ats`;
const A4_HEIGHT_PX = Math.floor((297 / 25.4) * 96);

const photo = await readFile(`${root}cv/source/photo.jpg`);
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

await mkdir(outDir, { recursive: true });
await mkdir(atsDir, { recursive: true });
const browser = await chromium.launch();
let failed = false;

try {
  const page = await browser.newPage();
  for (const cv of cvVariants) {
    await page.setContent(renderCv(cv, photoSrc), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const fontsOk = await page.evaluate(() =>
      ['400 12px "Geist"', '600 12px "Geist"', '700 12px "Bricolage Grotesque"'].every((font) => document.fonts.check(font)),
    );
    // The .page box clips at A4; measure the content inside the columns instead.
    const overflow = await page.evaluate(
      (limit) =>
        [...document.querySelectorAll(".side, .main")].map((el) => {
          const last = el.lastElementChild?.getBoundingClientRect().bottom ?? 0;
          return Math.round(last - limit);
        }),
      A4_HEIGHT_PX,
    );

    const file = cvFileName(cv.variant, cv.lang);
    await page.pdf({ path: `${outDir}/${file}`, format: "A4", printBackground: true, preferCSSPageSize: true });

    const atsFile = cvFileName(cv.variant, cv.lang, "ats");
    const atsPage = await browser.newPage();
    await atsPage.setContent(renderCvAts(cv), { waitUntil: "load" });
    await atsPage.pdf({ path: `${atsDir}/${atsFile}`, format: "A4", preferCSSPageSize: true });
    await atsPage.close();
    console.log(`✓ cv/ats/${atsFile}`);

    const problems = [];
    if (!fontsOk) problems.push("web fonts did not load");
    overflow.forEach((px, i) => px > 0 && problems.push(`${i === 0 ? "sidebar" : "main"} overflows A4 by ${px}px`));
    console.log(`${problems.length ? "✗" : "✓"} public/cv/${file}${problems.length ? ` — ${problems.join("; ")}` : ""}`);
    if (problems.length) failed = true;
  }
} finally {
  await browser.close();
}

if (failed) process.exit(1);
