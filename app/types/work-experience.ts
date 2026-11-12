import type { RichTextContent } from "@graphcms/rich-text-types";
import { KnownTech } from "./projects";

export type WorkExperience = {
  role: string;
  companyName: string;
  companyUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  technologies: Pick<KnownTech, "name">[];
  description?: {
    raw: RichTextContent;
  } | null;
};
