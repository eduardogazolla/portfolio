"use client";

import { PageSection } from "@/app/componentes/page-section";
import { MoreProjectsNote } from "@/app/componentes/more-projects-note";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Project } from "@/app/types/projects";
import type { Social } from "@/app/types/page-info";
import { ProjectCard } from "../projects-card";

type ProjectsFeaturedProps = {
  projects: Project[];
  socials: Social[];
};

export const ProjectsFeatured = ({ projects, socials }: ProjectsFeaturedProps) => {
  const { translations } = useLanguage();

  return (
    <PageSection className="pb-16 md:pb-[120px]" innerClassName="flex flex-col gap-8 md:gap-10">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} priority={index === 0} viewProjectLabel={translations.projectsSection.viewProject} />
      ))}
      <MoreProjectsNote socials={socials} className="border-t border-line pt-6 md:border-t-0 md:pt-10" />
    </PageSection>
  );
};
