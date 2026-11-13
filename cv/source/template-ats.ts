import type { CvContent, CvEntry, CvLang } from "./types";
import { esc, htmlLang, link, rich } from "./html.ts";

// ATS version of the same content: one column in reading order, standard headings, a system font,
// no photo, icons, tables, columns or letter-spacing (they scramble text extraction).

const HEADINGS: Record<CvLang, Record<"summary" | "highlights" | "experience" | "projects" | "skills" | "education" | "languages" | "courses", string>> = {
  pt: {
    summary: "Resumo",
    highlights: "Principais resultados",
    experience: "Experiência Profissional",
    projects: "Projetos",
    skills: "Habilidades",
    education: "Formação Acadêmica",
    languages: "Idiomas",
    courses: "Cursos",
  },
  en: {
    summary: "Summary",
    highlights: "Key Achievements",
    experience: "Work Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    courses: "Courses",
  },
};

const LEVEL_NAMES: Record<CvLang, Record<CvContent["languages"][number]["level"], string>> = {
  pt: { A1: "básico (A1)", A2: "básico (A2)", B1: "intermediário (B1)", B2: "intermediário avançado (B2)", C: "avançado (C1)" },
  en: { A1: "beginner (A1)", A2: "elementary (A2)", B1: "intermediate (B1)", B2: "upper intermediate (B2)", C: "advanced (C1)" },
};

const SEP = " | ";

// Visible text without the scheme, the full URL in the href.
const plainUrl = (href: string) => href.replace(/^mailto:/, "").replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

const bullets = (items: string[]) => (items.length ? `<ul>${items.map((item) => `<li>${rich(item)}</li>`).join("")}</ul>` : "");

const job = (item: CvEntry) => `
  <h3>${esc(item.title)}${SEP}${esc(item.org)}</h3>
  <p class="meta">${[item.meta, item.period].filter(Boolean).map((v) => esc(v!)).join(SEP)}</p>
  ${item.context ? `<p>${esc(item.context)}</p>` : ""}
  ${bullets(item.bullets)}`;

const project = (item: CvEntry) => `
  <h3>${esc(item.title)}</h3>
  <p class="meta">${[esc(item.org), item.meta ? esc(item.meta) : "", item.link ? link(item.link.href, plainUrl(item.link.href)) : "", esc(item.period)]
    .filter(Boolean)
    .join(SEP)}</p>
  ${bullets(item.bullets)}`;

const STYLES = `
  @page { size: A4; margin: 15mm 17mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 10pt/1.4 Arial, Helvetica, sans-serif; color: #000; font-variant-ligatures: none; }
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 18pt; line-height: 1.2; }
  .headline { font-size: 11pt; font-weight: bold; margin-top: 1mm; }
  .contact { margin-top: 1.5mm; }
  h2 { font-size: 11.5pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: .6mm; margin: 5mm 0 2mm; }
  h3 { font-size: 10.5pt; margin-top: 2.6mm; break-after: avoid; }
  .meta { color: #333; break-after: avoid; }
  ul { margin: 1mm 0 0 5mm; }
  li { margin-bottom: .6mm; }
  .line { margin-bottom: 1mm; }
`;

export const renderCvAts = (cv: CvContent) => {
  const h = HEADINGS[cv.lang];
  // Location first, so a wrapped line never starts with a separator.
  const ordered = [...cv.contact].sort((x, y) => Number(y.icon === "pin") - Number(x.icon === "pin"));
  const contact = ordered.map((item) => (item.href ? link(item.href, plainUrl(item.href)) : esc(item.label))).join(SEP);
  const sections = {
    experience: `<h2>${h.experience}</h2>${cv.experience.map(job).join("")}`,
    projects: `<h2>${h.projects}</h2>${cv.projects.map(project).join("")}`,
  };

  return `<!doctype html>
<html lang="${htmlLang(cv.lang)}">
<head>
<meta charset="utf-8" />
<title>${esc(cv.documentTitle)}</title>
<style>${STYLES}</style>
</head>
<body>
<h1>${esc(cv.name.first)} ${esc(cv.name.last)}</h1>
<p class="headline">${esc(cv.headline)}${cv.subline ? `${SEP}${esc(cv.subline)}` : ""}</p>
<p class="contact">${contact}</p>

<h2>${h.summary}</h2>
<p>${rich(cv.summary)}</p>

<h2>${h.highlights}</h2>
<ul>${cv.highlights.map((item) => `<li><strong>${esc(item.value)}</strong>: ${esc(item.text)}</li>`).join("")}</ul>

${cv.sections.map((key) => sections[key]).join("")}

<h2>${h.skills}</h2>
${cv.skills.map((group) => `<p class="line"><strong>${esc(group.title)}:</strong> ${esc([...group.featured, ...group.others].join(", "))}</p>`).join("")}

<h2>${h.education}</h2>
${cv.education.map((item) => `<p class="line"><strong>${esc(item.title)}</strong>${SEP}${esc(item.detail)}</p>`).join("")}

<h2>${h.languages}</h2>
${cv.languages.map((item) => `<p class="line">${esc(item.name)}: ${LEVEL_NAMES[cv.lang][item.level]}</p>`).join("")}

<h2>${h.courses}</h2>
${cv.courses.map((item) => `<p class="line"><strong>${esc(item.title)}</strong>${SEP}${esc(item.detail)}${SEP}${link(item.href, cv.labels.certificate)}</p>`).join("")}
</body>
</html>`;
};
