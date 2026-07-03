import type { RichTextContent } from "@graphcms/rich-text-types";
import { KnownTech, Project } from "./projects";
import { WorkExperience } from "./work-experience";

export type Social = {
  url: string;
  iconSvg: string;
};

export type HomePageInfo = {
  introduction: {
    raw: RichTextContent;
  };
  technologies: KnownTech[];
  profilePicture: {
    url: string;
  };
  socials: Social[];
  knownTechs: KnownTech[];
  highlightProjects: Project[];
};

export type ProjectPageData = {
  project: Project ;
};

export type ProjectsPageData = {
  projects: Project[];
};

export type ProjectsPageStaticData = {
  projects: {
    slug: string;
  }[];
};

export type HomePageData = {
  page: HomePageInfo;
  workExperiences: WorkExperience[];
};

// Localized types for aliased GraphQL queries (both locales fetched in parallel)

export type LocalizedHomePageData = {
  ptPage: HomePageInfo;
  enPage: HomePageInfo;
  ptWorkExperiences: WorkExperience[];
  enWorkExperiences: WorkExperience[];
};

export type LocalizedProjectsPageData = {
  ptProjects: Project[];
  enProjects: Project[];
};

export type LocalizedProjectPageData = {
  ptProject: Project;
  enProject: Project;
};

