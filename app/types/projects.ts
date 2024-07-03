import type { RichTextContent } from "@graphcms/rich-text-types";

export type KnownTech = {
  iconSvg: string;
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
  shortDescription: string;
  description: {
    raw: RichTextContent;
    text: string;
  };
  gitHubUrl?: string;
  liveProjectUrl?: string;
  technologies: KnownTech[];
  thumbnail: {
    url: string;
  };
  pageThumbnail: {
    url: string;
  };
  sections: ProjectSection[];
};
