"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedProjectsPageData } from "@/app/types/page-info";
import { ProjectsList } from "./projects-list";

type ProjectsListClientProps = {
  data: LocalizedProjectsPageData;
};

export const ProjectsListClient = ({ data }: ProjectsListClientProps) => {
  const { locale } = useLanguage();

  const hasEnProjects = data.enProjects && data.enProjects.length > 0 && !!data.enProjects[0]?.title;
  const rawProjects = locale === "en" && hasEnProjects
    ? data.enProjects
    : data.ptProjects;

  const projects = rawProjects.map((project, pIdx) => {
    const enProject = data.enProjects?.[pIdx];
    return {
      ...project,
      technologies: project.technologies?.map((tech, idx) => ({
        ...tech,
        name: tech.name || enProject?.technologies?.[idx]?.name || '',
      })) ?? [],
    };
  });

  return <ProjectsList projects={projects} />;
};
