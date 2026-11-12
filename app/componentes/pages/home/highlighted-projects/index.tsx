"use client";

import { SectionTitle } from "@/app/componentes/section-title";
import { Link } from "@/app/componentes/link";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Project } from "@/app/types/projects";
import type { Social } from "@/app/types/page-info";
import { getSocialLabel } from "@/app/utils/socials";
import { ProjectCard } from "./project-card";

type HighlightedProjectsProps = {
  projects: Project[];
  socials: Social[];
};

const isGitHub = (social: Social) => /(^|[/.@])github\.com(?=[/:?#]|$)/i.test(social.url);

export const HighlightedProjects = ({ projects, socials }: HighlightedProjectsProps) => {
  const { translations } = useLanguage();
  const { projectsSection } = translations;

  if (!projects?.length) return null;

  const github = socials?.find(isGitHub);

  return (
    <section id="projects" className="container pt-28 md:pt-10 md:pb-40">
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

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 md:mt-14 md:flex-row md:items-center md:gap-4 md:pt-7">
        <p className="text-body-m text-text-muted">{projectsSection.moreComing}</p>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <Link href="/projects" arrow className="text-label-m md:hidden">
            {projectsSection.viewAllProjects}
          </Link>
          {github && (
            <Link href={github.url} className="text-label-m">
              {getSocialLabel(github)}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
