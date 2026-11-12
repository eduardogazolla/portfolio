"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/app/componentes/context/language-context";
import { Link } from "@/app/componentes/link";
import { PageSection } from "@/app/componentes/page-section";
import { RichText } from "@/app/componentes/rich-text";
import { SectionTitle } from "@/app/componentes/section-title";
import { TechBadge } from "@/app/componentes/tech-badge";
import { cn } from "@/app/lib/utils";
import { Project } from "@/app/types/projects";
import { MainImage } from "./main-image";

type ProjectDetailsProps = {
  project: Project;
};

type MetaColumnProps = {
  label: string;
  children: ReactNode;
  /** Mobile (Figma 11:402) shows no label, so it stays for screen readers only. */
  labelOnlyDesktop?: boolean;
};

const MetaColumn = ({ label, children, labelOnlyDesktop }: MetaColumnProps) => (
  <div className="flex flex-col gap-1.5 border-t border-line pt-3.5 md:gap-3 md:pt-5">
    <p className={cn("text-label-m text-text-muted", labelOnlyDesktop && "sr-only md:not-sr-only")}>{label}</p>
    {children}
  </div>
);

export const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const { translations } = useLanguage();
  const { backToProjects, whatItIs, context, links, about, technologies } = translations.projectDetail;
  const { viewCode, viewLive } = translations.projectsSection;
  const hasLinks = Boolean(project.gitHubUrl || project.liveProjectUrl);
  const imageUrl = project.pageThumbnail?.url;
  const valueClass = "text-body-m text-text md:text-body-l";

  return (
    <>
      {/* Figma 9:243 (desktop) / 11:413 (mobile) */}
      <PageSection className="py-8 md:py-16" innerClassName="flex flex-col gap-6 md:gap-10">
        <Link href="/projects" arrow className="text-label-m">
          {backToProjects}
        </Link>
        <SectionTitle as="h1" title={project.title} />
        <div className="grid gap-6 md:grid-cols-[3fr_3fr_4fr] md:gap-0">
          <MetaColumn label={whatItIs}>
            <p className={valueClass}>{project.shortDescription}</p>
          </MetaColumn>
          {project.context && (
            <MetaColumn label={context}>
              <p className={valueClass}>{project.context}</p>
            </MetaColumn>
          )}
          {hasLinks && (
            <MetaColumn label={links} labelOnlyDesktop>
              <div className="flex gap-6">
                {project.gitHubUrl && (
                  <Link href={project.gitHubUrl} className="text-label-m">
                    {viewCode}
                  </Link>
                )}
                {project.liveProjectUrl && (
                  <Link href={project.liveProjectUrl} className="text-label-m">
                    {viewLive}
                  </Link>
                )}
              </div>
            </MetaColumn>
          )}
        </div>
      </PageSection>

      {imageUrl && <MainImage src={imageUrl} alt={project.title} />}

      {/* Figma 9:277 (desktop) / 11:444 (mobile) */}
      <PageSection
        className="py-14 md:py-[120px]"
        innerClassName="grid gap-5 md:grid-cols-[480px_1fr] md:grid-rows-[auto_1fr] md:gap-x-[120px] md:gap-y-6"
      >
        <h2 className="font-display text-h2 text-text md:text-h1">{about}</h2>
        <div className="text-body-m text-text-muted md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[600px] md:text-body-l">
          <RichText content={project.description.raw} />
        </div>
        <div className="flex flex-col gap-3 md:col-start-1 md:gap-6">
          <p className="hidden text-label-m text-text-muted md:block">{technologies}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechBadge key={tech.name} name={tech.name} />
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
};
