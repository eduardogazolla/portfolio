"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { LocalizedProjectsPageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { filterProjectsByTech, getProjectsLayout, getUniqueTechs } from "@/app/utils/projects-layout";
import { PageIntroduction } from "./page-introduction";
import { ProjectsList } from "./projects-list";
import { ProjectsFeatured } from "./projects-list/projects-featured";
import { ALL_FILTER, TechFilter } from "./projects-list/tech-filter";

type ProjectsListClientProps = {
  data: LocalizedProjectsPageData;
};

export const ProjectsListClient = ({ data }: ProjectsListClientProps) => {
  const { locale } = useLanguage();
  const [filter, setFilter] = useState(ALL_FILTER);

  // EN projects are matched by slug; a missing EN project falls back to PT.
  const projects = useMemo(() => {
    const enBySlug = new Map(data.enProjects.map((project) => [project.slug, project]));
    return data.ptProjects.map((project) => pickLocale(project, enBySlug.get(project.slug), locale));
  }, [data.ptProjects, data.enProjects, locale]);

  if (getProjectsLayout(projects.length) === "featured") {
    return (
      <>
        <PageIntroduction />
        <ProjectsFeatured projects={projects} socials={data.socials} />
      </>
    );
  }

  const techs = getUniqueTechs(projects);
  const { projects: visible, count } = filterProjectsByTech(projects, filter);

  return (
    <>
      <PageIntroduction count={count}>
        <TechFilter techs={techs} value={filter} onChange={setFilter} />
      </PageIntroduction>
      <ProjectsList projects={visible} filter={filter} onClearFilter={() => setFilter(ALL_FILTER)} />
    </>
  );
};
