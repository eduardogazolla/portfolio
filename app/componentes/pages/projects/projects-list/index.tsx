"use client";

import { useState } from "react";
import { PageSection } from "@/app/componentes/page-section";
import { useLanguage } from "@/app/componentes/context/language-context";
import { Button } from "@/app/componentes/button";
import type { Project } from "@/app/types/projects";
import { ALL_FILTER } from "./tech-filter";
import { ProjectRow } from "./project-row";
import { CursorPreview } from "./cursor-preview";

type ProjectsListProps = {
  /** Projects already filtered by the active technology. */
  projects: Project[];
  filter: string;
  onClearFilter: () => void;
};

export const ProjectsList = ({ projects, filter, onClearFilter }: ProjectsListProps) => {
  const { translations } = useLanguage();
  const [hovered, setHovered] = useState<Project | null>(null);

  return (
    <PageSection className="pb-16 md:pb-[120px]">
      {projects.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-t border-line pt-8">
          <p className="text-body-m text-text-muted">
            {translations.projectsSection.noProjectsWith(filter === ALL_FILTER ? "" : filter)}
          </p>
          <Button variant="secondary" onClick={onClearFilter}>
            {translations.projectsSection.clearFilter}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-8 md:gap-0 md:border-t md:border-line">
          {projects.map((project) => (
            <ProjectRow key={project.slug} project={project} onHover={setHovered} />
          ))}
        </ul>
      )}
      <CursorPreview src={hovered?.thumbnail?.url ?? null} />
    </PageSection>
  );
};
