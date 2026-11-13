// Builds the CV PDFs from cv/source (see docs/architecture/cv-generation.md):
// - public/cv: the designed one-page CVs (template.ts), served by the site;
// - cv/ats (gitignored, private): plain ATS versions of the same content (template-ats.ts), for job portals.
// Usage: npm run cv:build   (Node 22.18+ strips the TypeScript types natively)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { cvVariants } from "../cv/source/content.ts";
import { renderCv, cvFileName } from "../cv/source/template.ts";
import { renderCvAts } from "../cv/source/template-ats.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = `${root}public/cv`;
const atsDir = `${root}cv/ats`;
const A4_HEIGHT_PX = Math.floor((297 / 25.4) * 96);
// Faces the designed CV uses; each must be registered and loaded, or the PDF falls back to system fonts.
const REQUIRED_FACES = [
  ["Geist", "400"],
  ["Geist", "600"],
  ["Bricolage Grotesque", "700"],
];

const photo = await readFile(`${root}cv/source/photo.jpg`);
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

await mkdir(outDir, { recursive: true });
await mkdir(atsDir, { recursive: true });
const browser = await chromium.launch();
let failed = false;

try {
  const page = await browser.newPage();
  const atsPage = await browser.newPage();

  for (const cv of cvVariants) {
    await page.setContent(renderCv(cv, photoSrc), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const missingFaces = await page.evaluate(
      (faces) =>
        faces
          .filter(([family, weight]) => ![...document.fonts].some((f) => f.family.replace(/"/g, "") === family && f.weight === weight && f.status === "loaded"))
          .map(([family, weight]) => `${family} ${weight}`),
      REQUIRED_FACES,
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

    const problems = [];
    if (missingFaces.length) problems.push(`fonts not loaded: ${missingFaces.join(", ")}`);
    overflow.forEach((px, i) => px > 0 && problems.push(`${i === 0 ? "sidebar" : "main"} overflows A4 by ${px}px`));

    // Only replace the served PDF when the render is good.
    const file = cvFileName(cv.variant, cv.lang);
    if (problems.length) {
      failed = true;
      console.log(`✗ public/cv/${file} (kept the previous file): ${problems.join("; ")}`);
    } else {
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      await writeFile(`${outDir}/${file}`, pdf);
      console.log(`✓ public/cv/${file}`);
    }

    const atsFile = cvFileName(cv.variant, cv.lang, "ats");
    await atsPage.setContent(renderCvAts(cv), { waitUntil: "load" });
    await atsPage.pdf({ path: `${atsDir}/${atsFile}`, format: "A4", preferCSSPageSize: true });
    console.log(`✓ cv/ats/${atsFile}`);
  }
} finally {
  await browser.close();
}

if (failed) process.exit(1);
