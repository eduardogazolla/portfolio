"use client";

import Image from "next/image";
import { Link } from "@/app/componentes/link";
import { TechBadge } from "@/app/componentes/tech-badge";
import { InspectOutline } from "@/app/componentes/inspect-outline";
import type { Project } from "@/app/types/projects";

type ProjectRowProps = {
  project: Project;
  onHover: (project: Project | null) => void;
};

const fine = "[@media(hover:hover)_and_(pointer:fine)]";

// Row on md+ (title, summary, techs, arrow); a card with image on mobile, where there is no hover.
export const ProjectRow = ({ project, onHover }: ProjectRowProps) => (
  <li
    onPointerEnter={(event) => event.pointerType === "mouse" && onHover(project)}
    onPointerLeave={() => onHover(null)}
    className={`group relative flex flex-col gap-3.5 border-t border-line pt-6 transition-[background-color,transform] duration-fast ease-out active:scale-[0.98] motion-reduce:active:scale-100 md:flex-row md:items-center md:gap-8 md:border-b md:border-t-0 md:px-6 md:py-9 md:active:scale-100 ${fine}:hover:bg-surface`}
  >
    {project.thumbnail?.url && (
      <div className="relative aspect-[7/4] w-full overflow-hidden rounded-md bg-surface md:hidden">
        <Image src={project.thumbnail.url} alt={project.title} fill sizes="(min-width: 768px) 0px, calc(100vw - 40px)" className="object-cover" />
      </div>
    )}
    {project.context && <p className="text-label-m text-text-muted md:w-[72px] md:shrink-0">{project.context}</p>}
    <div className="flex min-w-0 flex-1 flex-col gap-3.5 md:gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2>
          {/* Stretched link: covers the whole row. The outline is positioned on the inner span. */}
          <Link
            href={`/projects/${project.slug}`}
            arrow={false}
            className={`font-display text-h2 after:absolute after:inset-0 ${fine}:hover:text-text`}
          >
            <span className="relative">
              {project.title}
              <InspectOutline variant="hover" measure selector="h2" />
            </span>
          </Link>
        </h2>
        <span aria-hidden="true" className="text-h3 text-text md:hidden">
          ↗
        </span>
      </div>
      <p className="text-body-m text-text-muted">{project.shortDescription}</p>
    </div>
    <ul className="flex flex-wrap gap-2 md:max-w-[360px] md:shrink-0 md:justify-end">
      {project.technologies.map((tech) => (
        <li key={`${project.slug}-${tech.name}`}>
          <TechBadge name={tech.name} />
        </li>
      ))}
    </ul>
    <span
      aria-hidden="true"
      className={`hidden size-8 shrink-0 items-center justify-center text-h3 text-text transition-transform duration-fast ease-out motion-reduce:transform-none md:flex ${fine}:group-hover:-translate-y-[2px] ${fine}:group-hover:translate-x-[2px] ${fine}:group-hover:text-accent`}
    >
      ↗
    </span>
  </li>
);
