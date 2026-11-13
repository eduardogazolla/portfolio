export type CvVariant = "qa" | "java";
export type CvLang = "pt" | "en";

export type CvLink = { label: string; href: string };

/** A timeline item (job or project). Strings accept **bold** markup. */
export type CvEntry = {
  title: string;
  period: string;
  org: string;
  meta?: string;
  link?: CvLink;
  context?: string;
  bullets: string[];
};

export type CvSkillGroup = { title: string; featured: string[]; others: string[] };

export type CvContent = {
  variant: CvVariant;
  lang: CvLang;
  /** PDF <title> metadata. */
  documentTitle: string;
  name: { first: string; last: string };
  headline: string;
  subline?: string;
  summary: string;
  labels: {
    contact: string;
    highlights: string;
    projects: string;
    experience: string;
    languages: string;
    education: string;
    courses: string;
    featured: string;
    others: string;
    certificate: string;
    photoAlt: string;
  };
  contact: { label: string; href?: string; icon: "mail" | "linkedin" | "github" | "web" | "pin" }[];
  skills: CvSkillGroup[];
  languages: { name: string; level: "A1" | "A2" | "B1" | "B2" | "C" }[];
  education: { title: string; detail: string }[];
  courses: { title: string; detail: string; href: string }[];
  highlights: { value: string; label: string; text: string }[];
  /** Main column order: QA leads with experience, Java with projects. */
  sections: ("projects" | "experience")[];
  projects: CvEntry[];
  experience: CvEntry[];
};
