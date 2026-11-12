"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedProjectsPageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { ProjectsList } from "./projects-list";

type ProjectsListClientProps = {
  data: LocalizedProjectsPageData;
};

export const ProjectsListClient = ({ data }: ProjectsListClientProps) => {
  const { locale } = useLanguage();

  const projects = data.ptProjects.map((project, index) =>
    pickLocale(project, data.enProjects[index], locale),
  );

  return <ProjectsList projects={projects} />;
};
