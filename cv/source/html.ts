import type { CvLang, CvVariant } from "./types";

// Shared by both templates. Every content string goes through esc(); only **bold** is turned back into markup.

export type CvFormat = "design" | "ats";

export const cvFileName = (variant: CvVariant, lang: CvLang, format: CvFormat = "design") =>
  `eduardo-gazolla-cv-${variant}-${lang}${format === "ats" ? "-ats" : ""}.pdf`;

export const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const rich = (value: string) => esc(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

export const safeHref = (href: string) => {
  if (!/^(https:\/\/|mailto:)/i.test(href)) throw new Error(`Unsafe href in CV content: ${href}`);
  return esc(href);
};

export const link = (href: string, label: string) => `<a href="${safeHref(href)}">${esc(label)}</a>`;

export const htmlLang = (lang: CvLang) => (lang === "pt" ? "pt-BR" : "en");
