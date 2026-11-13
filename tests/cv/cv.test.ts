import { createHash } from "node:crypto";
import { cvVariants } from "@/cv/source/content";
import { renderCv, cvFileName } from "@/cv/source/template";
import { renderCvAts } from "@/cv/source/template-ats";
import type { CvContent } from "@/cv/source/types";

// The PDFs are public: no client/brand names (NDA), internal jargon or phone may reach them.
// Brand names are stored as SHA-256 hashes so this public repo doesn't name them either.
const FORBIDDEN_WORD_HASHES = new Set([
  "ce3d58ff5de08b1bfe1b4be2a963420f7f4b373a15ffc7911d50e0a3754ddd6a",
  "e12d20c930609d2e939e5e1d9599174572a0d8f70654713118b8af712906071c",
  "59e6cf51fbb5346d67f2199da90a56cc6d551f05ed4d49e487b583fa1dac6b93",
  "6f2700f8b07ea67aa3734ad2ee5a99fcd9ecba947e4d5fc6048b4ddc436c45cd",
  "ad21acb889da17fe038f780b19e02f0110bbcba66f3248f4912d9f6539919c8f",
]);
const FORBIDDEN_PATTERNS = [/\bGMUD\b/, /\bPDI\b/, /\+55/, /\d{4,5}-\d{4}\b/];

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const expectNoLeaks = (html: string) => {
  const words = html.toLowerCase().match(/[a-z]+/g) ?? [];
  expect(words.filter((word) => FORBIDDEN_WORD_HASHES.has(sha256(word)))).toEqual([]);
  for (const pattern of FORBIDDEN_PATTERNS) expect(html).not.toMatch(pattern);
};

describe("leak guard", () => {
  it("catches a hashed brand name and a phone number", () => {
    // Self-check with a harmless word: the guard must flag words whose hash is listed.
    FORBIDDEN_WORD_HASHES.add(sha256("canary"));
    expect(() => expectNoLeaks("<p>Canary</p>")).toThrow();
    FORBIDDEN_WORD_HASHES.delete(sha256("canary"));
    expect(() => expectNoLeaks("<p>(44) 91234-5678</p>")).toThrow();
  });
});

describe("CV variants", () => {
  it("has the four public variants", () => {
    expect(cvVariants.map((cv) => `${cv.variant}-${cv.lang}`).sort()).toEqual([
      "java-en",
      "java-pt",
      "qa-en",
      "qa-pt",
    ]);
  });

  it.each(cvVariants.map((cv) => [`${cv.variant}-${cv.lang}`, cv] as const))(
    "%s leaks no client, internal or phone data",
    (_, cv) => {
      expectNoLeaks(renderCv(cv, "data:image/jpeg;base64,"));
    },
  );

  it.each(cvVariants.map((cv) => [`${cv.variant}-${cv.lang}`, cv] as const))(
    "%s links to the portfolio and sets the document language",
    (_, cv) => {
      const html = renderCv(cv, "data:image/jpeg;base64,");
      expect(html).toContain('href="https://eduardogazolla.dev"');
      expect(html).toContain(`<html lang="${cv.lang === "pt" ? "pt-BR" : "en"}">`);
      expect(html).toContain(`<title>${cv.documentTitle}</title>`);
    },
  );
});

describe("renderCv", () => {
  const base = cvVariants[0];

  it("escapes HTML in content", () => {
    const cv: CvContent = { ...base, summary: '<script>alert("x")</script> & co' };
    const html = renderCv(cv, "data:image/jpeg;base64,");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; co");
  });

  it("turns **bold** markup into <strong> after escaping", () => {
    const cv: CvContent = { ...base, summary: "a **<b>** c" };
    expect(renderCv(cv, "data:image/jpeg;base64,")).toContain("a <strong>&lt;b&gt;</strong> c");
  });

  it("rejects non-http(s)/mailto links", () => {
    const cv: CvContent = {
      ...base,
      contact: [{ label: "x", href: "javascript:alert(1)", icon: "web" }],
    };
    expect(() => renderCv(cv, "data:image/jpeg;base64,")).toThrow(/unsafe href/i);
  });

  it("names the public file by variant and language", () => {
    expect(cvFileName("qa", "pt")).toBe("eduardo-gazolla-cv-qa-pt.pdf");
    expect(cvFileName("java", "en")).toBe("eduardo-gazolla-cv-java-en.pdf");
  });
});

describe("renderCvAts", () => {
  const html = (cv: CvContent) => renderCvAts(cv);

  it.each(cvVariants.map((cv) => [`${cv.variant}-${cv.lang}`, cv] as const))(
    "%s is plain, single-column text an ATS can parse",
    (_, cv) => {
      const out = html(cv);
      expectNoLeaks(out);
      // No photo, icons, tables or letter-spaced headings (they scramble text extraction).
      expect(out).not.toMatch(/<img|<svg|<table|letter-spacing|grid-template-columns/);
      expect(out).toContain(`<h1>${cv.name.first} ${cv.name.last}</h1>`);
      // Full URLs as visible text, so they survive copy-paste parsing.
      expect(out).toContain("https://eduardogazolla.dev");
      expect(out).toContain("eduardogazolla1@gmail.com");
    },
  );

  it("uses standard section headings", () => {
    const pt = html(cvVariants.find((cv) => cv.variant === "qa" && cv.lang === "pt")!);
    for (const heading of ["Resumo", "Experiência Profissional", "Projetos", "Habilidades", "Formação Acadêmica", "Idiomas", "Cursos"])
      expect(pt).toContain(`<h2>${heading}</h2>`);
    const en = html(cvVariants.find((cv) => cv.variant === "java" && cv.lang === "en")!);
    for (const heading of ["Summary", "Work Experience", "Projects", "Skills", "Education", "Languages", "Courses"])
      expect(en).toContain(`<h2>${heading}</h2>`);
  });

  it("keeps the variant's section order", () => {
    const java = html(cvVariants.find((cv) => cv.variant === "java" && cv.lang === "pt")!);
    expect(java.indexOf("<h2>Projetos</h2>")).toBeLessThan(java.indexOf("<h2>Experiência Profissional</h2>"));
  });

  it("escapes HTML in content", () => {
    const out = html({ ...cvVariants[0], summary: "<i>x</i>" });
    expect(out).toContain("&lt;i&gt;x&lt;/i&gt;");
  });

  it("names the ATS file with an -ats suffix", () => {
    expect(cvFileName("qa", "pt", "ats")).toBe("eduardo-gazolla-cv-qa-pt-ats.pdf");
  });
});
