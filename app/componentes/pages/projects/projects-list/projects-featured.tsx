"use client";

import { PageSection } from "@/app/componentes/page-section";
import { Link } from "@/app/componentes/link";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Project } from "@/app/types/projects";
import type { Social } from "@/app/types/page-info";
import { getSocialLabel, isGitHubSocial } from "@/app/utils/socials";
import { ProjectCard } from "../projects-card";

type ProjectsFeaturedProps = {
  projects: Project[];
  socials: Social[];
};

export const ProjectsFeatured = ({ projects, socials }: ProjectsFeaturedProps) => {
  const { translations } = useLanguage();
  const github = socials.find(isGitHubSocial);

  return (
    <PageSection className="pb-16 md:pb-[120px]" innerClassName="flex flex-col gap-8 md:gap-10">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} priority={index === 0} viewProjectLabel={translations.projectsSection.viewProject} />
      ))}
      <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:gap-4 md:border-t-0 md:pt-10">
        <p className="text-body-m text-text-muted">{translations.projectsSection.moreComing}</p>
        {github && (
          <Link href={github.url} className="text-label-m">
            {getSocialLabel(github)}
          </Link>
        )}
      </div>
    </PageSection>
  );
};
