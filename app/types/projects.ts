import type { RichTextContent } from "@graphcms/rich-text-types";

export type KnownTech = {
  name: string;
  startDate: string;
};

export type ProjectSection = {
  title: string;
  image: {
    url: string;
  };
};

export type Project = {
  slug: string;
  title: string;
  context?: string | null;
  shortDescription: string;
  description?: {
    raw: RichTextContent;
    text: string;
  } | null;
  gitHubUrl?: string;
  liveProjectUrl?: string;
  technologies: Pick<KnownTech, "name">[];
  thumbnail: {
    url: string;
  };
  pageThumbnail: {
    url: string;
  };
  sections: ProjectSection[];
};
