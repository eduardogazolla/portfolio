"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedProjectPageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { ProjectDetails } from "./project-details";
import { ProjectSections } from "./project-sections";

type ProjectDetailClientProps = {
  data: LocalizedProjectPageData;
};

export const ProjectDetailClient = ({ data }: ProjectDetailClientProps) => {
  const { locale } = useLanguage();

  const project = pickLocale(data.ptProject, data.enProject, locale);

  return (
    <>
      <ProjectDetails project={project} />
      <ProjectSections sections={project.sections} />
    </>
  );
};
