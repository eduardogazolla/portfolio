"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedProjectPageData } from "@/app/types/page-info";
import { ProjectDetails } from "./project-details";
import { ProjectSections } from "./project-sections";

type ProjectDetailClientProps = {
  data: LocalizedProjectPageData;
};

export const ProjectDetailClient = ({ data }: ProjectDetailClientProps) => {
  const { locale } = useLanguage();

  const hasEnProject = data.enProject && !!data.enProject.title && !!data.enProject.sections;
  const projectRaw = locale === "en" && hasEnProject
    ? data.enProject
    : data.ptProject;

  const project = {
    ...projectRaw,
    technologies: projectRaw.technologies?.map((tech, idx) => ({
      ...tech,
      name: tech.name || data.enProject?.technologies?.[idx]?.name || '',
    })) ?? [],
  };

  return (
    <>
      <ProjectDetails project={project} />
      <ProjectSections sections={project.sections} />
    </>
  );
};
