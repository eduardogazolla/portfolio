"use client";

import { PageSection } from "@/app/componentes/page-section";
import { SectionTitle } from "@/app/componentes/section-title";
import { Link } from "@/app/componentes/link";
import { MoreProjectsNote } from "@/app/componentes/more-projects-note";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Project } from "@/app/types/projects";
import type { Social } from "@/app/types/page-info";
import { ProjectCard } from "./project-card";

type HighlightedProjectsProps = {
  projects: Project[];
  socials: Social[];
};

export const HighlightedProjects = ({ projects, socials }: HighlightedProjectsProps) => {
  const { translations } = useLanguage();
  const { projectsSection } = translations;

  if (!projects?.length) return null;

  return (
    <PageSection id="projects" className="pt-28 md:pt-10 md:pb-40">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-12">
        <SectionTitle title={translations.projectsPage.title} />
        <Link href="/projects" arrow className="hidden text-label-m md:inline-flex md:pb-[3px]">
          {projectsSection.viewAllProjects}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-14 md:mt-14">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            viewProjectLabel={projectsSection.viewProject}
          />
        ))}
      </div>

      <MoreProjectsNote socials={socials} className="mt-6 border-t border-line pt-6 md:mt-14 md:pt-7">
        <Link href="/projects" arrow className="text-label-m md:hidden">
          {projectsSection.viewAllProjects}
        </Link>
      </MoreProjectsNote>
    </PageSection>
  );
};
