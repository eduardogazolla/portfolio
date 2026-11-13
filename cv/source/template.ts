import type { CvContent, CvEntry } from "./types";
import { esc, htmlLang, link, rich } from "./html.ts";

// Renders the designed CV into a self-contained A4 HTML page (printed to PDF by scripts/build-cv.mjs).

export { cvFileName } from "./html.ts";

const ICONS: Record<CvContent["contact"][number]["icon"], string> = {
  web: '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/>',
  mail: '<rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 4.5 5.5 4 5.5-4"/>',
  linkedin: '<rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 7v4M5 5v.01M8 11V7m0 2c0-1.5 3-2 3 0v2"/>',
  github: '<path d="M6 13c-3 1-3-1.5-4-2m8 3.5V12c0-1 .5-1.5 1-2-2-.2-4-1-4-4 0-.8.3-1.5.8-2-.1-.5-.1-1.3.2-2 0 0 .7-.2 2 .8a6.5 6.5 0 0 1 3 0c1.3-1 2-.8 2-.8.3.7.3 1.5.2 2 .5.5.8 1.2.8 2 0 3-2 3.8-4 4 .5.5 1 1 1 2v2.5"/>',
  pin: '<path d="M8 14s-4.5-4-4.5-7.5a4.5 4.5 0 0 1 9 0C12.5 10 8 14 8 14z"/><circle cx="8" cy="6.5" r="1.5"/>',
};

const icon = (name: keyof typeof ICONS) =>
  `<svg class="icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

const sideHeading = (title: string) => `<h2 class="side-h">${esc(title)}</h2>`;
const mainHeading = (title: string) => `<h2 class="main-h"><span>${esc(title)}</span></h2>`;

const chips = (items: string[], kind: "solid" | "ghost") =>
  items.length ? `<ul class="chips ${kind}">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : "";

const LEVELS = ["A1", "A2", "B1", "B2", "C"] as const;

const sidebar = (cv: CvContent, photoSrc: string) => `
  <aside class="side">
    <img class="photo" src="${esc(photoSrc)}" alt="${esc(cv.labels.photoAlt)}" />
    ${sideHeading(cv.labels.contact)}
    <ul class="contact">
      ${cv.contact
        .map((item) => `<li>${icon(item.icon)}${item.href ? link(item.href, item.label) : `<span>${esc(item.label)}</span>`}</li>`)
        .join("")}
    </ul>
    ${cv.skills
      .map(
        (group) => `
      ${sideHeading(group.title)}
      ${group.featured.length && group.others.length ? `<p class="side-sub">${esc(cv.labels.featured)}</p>` : ""}
      ${chips(group.featured, "solid")}
      ${group.featured.length && group.others.length ? `<p class="side-sub">${esc(cv.labels.others)}</p>` : ""}
      ${chips(group.others, group.featured.length ? "ghost" : "solid")}`,
      )
      .join("")}
    ${sideHeading(cv.labels.languages)}
    ${cv.languages
      .map(
        (language) => `
      <div class="lang"><span>${esc(language.name)}</span><strong>${esc(language.level)}</strong></div>
      <ol class="levels" aria-label="${esc(language.level)}">
        ${LEVELS.map((level) => `<li class="${LEVELS.indexOf(level) <= LEVELS.indexOf(language.level) ? "on" : ""}">${level}</li>`).join("")}
      </ol>`,
      )
      .join("")}
    ${sideHeading(cv.labels.education)}
    ${cv.education.map((item) => `<div class="side-item"><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div>`).join("")}
    ${sideHeading(cv.labels.courses)}
    ${cv.courses
      .map(
        (course) =>
          `<div class="side-item"><strong>${esc(course.title)}</strong><span>${esc(course.detail)} · ${link(course.href, cv.labels.certificate)}</span></div>`,
      )
      .join("")}
  </aside>`;

const entry = (item: CvEntry, current: boolean) => `
  <article class="entry ${current ? "current" : ""} ${item.bullets.length ? "" : "compact"}">
    <header>
      <h3>${esc(item.title)}</h3>
      <span class="period">${esc(item.period)}</span>
    </header>
    <p class="org"><strong>${esc(item.org)}</strong>${item.meta ? ` · ${esc(item.meta)}` : ""}${item.link ? ` · ${link(item.link.href, item.link.label)}` : ""}</p>
    ${item.context ? `<p class="context">${esc(item.context)}</p>` : ""}
    ${item.bullets.length ? `<ul class="bullets">${item.bullets.map((bullet) => `<li>${rich(bullet)}</li>`).join("")}</ul>` : ""}
  </article>`;

const section = (cv: CvContent, key: CvContent["sections"][number]) => {
  const items = key === "projects" ? cv.projects : cv.experience;
  const title = key === "projects" ? cv.labels.projects : cv.labels.experience;
  return `<section>${mainHeading(title)}<div class="timeline">${items.map((item, i) => entry(item, i === 0)).join("")}</div></section>`;
};

const STYLES = `
  @page { size: A4; margin: 0; }
  :root {
    --ink: #0a0a0b; --muted: #5d5d66; --faint: #8b8b92; --line: #e4e4ea;
    --accent: #4352f0; --accent-soft: #f2f3ff;
    --side-bg: #0b0b0d; --side-text: #f2f2ef; --side-muted: #8b8b92; --side-line: #232327;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; height: 297mm; }
  body { font: 8.3pt/1.38 "Geist", system-ui, sans-serif; color: var(--ink); background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: inherit; text-decoration: none; }
  ul, ol { list-style: none; }
  .page { display: grid; grid-template-columns: 64mm 1fr; height: 297mm; overflow: hidden; }

  .side { background: var(--side-bg); color: var(--side-text); padding: 8mm 6mm 6mm; }
  .photo { display: block; width: 25mm; height: 25mm; border-radius: 50%; object-fit: cover; margin: 0 auto 3mm;
    border: 2px solid var(--accent); }
  .side-h { font: 600 7.4pt/1 "Geist", sans-serif; letter-spacing: .18em; text-transform: uppercase; color: #8f9aff;
    padding-bottom: 1.6mm; margin: 3.8mm 0 2mm; border-bottom: 1px solid var(--side-line); }
  .side-sub { font-size: 6.4pt; letter-spacing: .14em; text-transform: uppercase; color: var(--side-muted); margin: 1.6mm 0 1.1mm; }
  .contact li { display: flex; align-items: center; gap: 2mm; margin-bottom: 1.2mm; font-size: 7.8pt; }
  .icon { width: 3.4mm; height: 3.4mm; flex: none; color: #8f9aff; }
  .chips { display: flex; flex-wrap: wrap; gap: 1mm; }
  .chips li { font-size: 7.2pt; padding: .45mm 2mm; border-radius: 99px; }
  .chips.solid li { background: var(--accent); color: #fff; }
  .chips.ghost li { border: 1px solid #3a3a44; color: var(--side-text); }
  .lang { display: flex; justify-content: space-between; font-size: 8.4pt; }
  .levels { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1mm; margin-top: 1.2mm; }
  .levels li { font-size: 6pt; color: var(--side-muted); text-align: center; padding-top: 1.4mm; border-top: 3px solid var(--side-line); }
  .levels li.on { border-top-color: var(--accent); }
  .side-item { margin-bottom: 1.6mm; }
  .side-item strong { display: block; font-weight: 600; font-size: 8.2pt; line-height: 1.3; }
  .side-item span { color: var(--side-muted); font-size: 7.4pt; }
  .side-item a { color: #8f9aff; }

  .main { padding: 8.5mm 8.5mm 6mm 8.5mm; }
  h1 { font: 700 25pt/1.02 "Bricolage Grotesque", sans-serif; letter-spacing: -.02em; }
  h1 em { font-style: normal; color: var(--accent); }
  .role { display: flex; align-items: center; flex-wrap: wrap; gap: 2.4mm; margin-top: 2.4mm; }
  .role strong { background: var(--accent); color: #fff; font-weight: 600; font-size: 9.6pt; padding: 1.2mm 3mm; border-radius: 1.4mm; }
  .role span { color: var(--muted); font-size: 8.2pt; }
  .summary { margin-top: 3mm; padding-left: 3mm; border-left: 2px solid var(--accent); color: #33333a; font-size: 8.3pt; }

  .main-h { display: flex; align-items: center; gap: 3mm; font: 600 8.6pt/1 "Geist", sans-serif; letter-spacing: .2em;
    text-transform: uppercase; margin: 4.2mm 0 2.2mm; }
  .main-h::after { content: ""; flex: 1; border-top: 1px solid var(--line); }
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8mm; }
  .card { background: var(--accent-soft); border-radius: 1.4mm; padding: 1.9mm 2.8mm; }
  .card b { display: block; font: 700 12pt/1.1 "Bricolage Grotesque", sans-serif; color: var(--accent); }
  .card small { display: block; font-size: 6.6pt; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; margin: .8mm 0 .4mm; }
  .card p { color: var(--muted); font-size: 7.6pt; line-height: 1.35; }

  .timeline { position: relative; padding-left: 5mm; }
  .timeline::before { content: ""; position: absolute; left: 1.2mm; top: 1.6mm; bottom: 1.6mm; border-left: 1px solid var(--line); }
  .entry { position: relative; margin-bottom: 2.2mm; }
  .entry::before { content: ""; position: absolute; left: -5mm; top: .9mm; width: 2.4mm; height: 2.4mm; border-radius: 50%;
    background: #fff; border: 1.4px solid var(--accent); }
  .entry.current::before { background: var(--accent); }
  .entry header { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm; }
  .entry h3 { font: 600 9.8pt/1.2 "Geist", sans-serif; }
  .period { flex: none; font-size: 7.4pt; font-weight: 600; color: var(--accent); background: var(--accent-soft); padding: .5mm 2.2mm; border-radius: 99px; }
  .org { font-size: 8pt; color: var(--muted); margin-top: .5mm; }
  .org strong { color: var(--ink); font-weight: 600; }
  .org a { color: var(--accent); }
  .context { color: var(--faint); font-size: 8pt; margin-top: .4mm; }
  .bullets { margin-top: .8mm; }
  .bullets li { position: relative; padding-left: 3.4mm; margin-bottom: .5mm; }
  .bullets li::before { content: "▸"; position: absolute; left: 0; color: var(--accent); font-size: 7pt; top: .2mm; }
  .bullets strong { font-weight: 600; }
  .entry.compact { margin-bottom: 1.6mm; }
`;

export const renderCv = (cv: CvContent, photoSrc: string) => `<!doctype html>
<html lang="${htmlLang(cv.lang)}">
<head>
<meta charset="utf-8" />
<title>${esc(cv.documentTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=Geist:wght@400;600;700&display=block" rel="stylesheet" />
<style>${STYLES}</style>
</head>
<body>
<div class="page">
  ${sidebar(cv, photoSrc)}
  <main class="main">
    <h1>${esc(cv.name.first)} <em>${esc(cv.name.last)}</em></h1>
    <div class="role"><strong>${esc(cv.headline)}</strong>${cv.subline ? `<span>${esc(cv.subline)}</span>` : ""}</div>
    <p class="summary">${rich(cv.summary)}</p>
    <section>
      ${mainHeading(cv.labels.highlights)}
      <div class="cards">
        ${cv.highlights.map((h) => `<div class="card"><b>${esc(h.value)}</b><small>${esc(h.label)}</small><p>${esc(h.text)}</p></div>`).join("")}
      </div>
    </section>
    ${cv.sections.map((key) => section(cv, key)).join("")}
  </main>
</div>
</body>
</html>`;
