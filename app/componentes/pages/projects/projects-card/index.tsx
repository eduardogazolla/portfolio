import Image from "next/image";
import { Link } from "@/app/componentes/link";
import { TechBadge } from "@/app/componentes/tech-badge";
import type { Project } from "@/app/types/projects";

type ProjectCardProps = {
  project: Project;
  viewProjectLabel: string;
};

// Featured block (fewer than 4 projects). Unlike the Home card, the whole card is the
// link on mobile (arrow beside the title, pressed scale 0.98) and "Ver projeto" shows from md.
export const ProjectCard = ({ project, viewProjectLabel }: ProjectCardProps) => (
  <article className="relative flex flex-col gap-4 border-t border-line pt-6 transition-transform duration-fast ease-out active:scale-[0.98] motion-reduce:active:scale-100 md:gap-8 md:border-t-0 md:pt-0 md:active:scale-100">
    <div
      data-testid="project-thumbnail"
      aria-hidden={project.thumbnail?.url ? undefined : "true"}
      className="relative aspect-[7/4] w-full overflow-hidden rounded-md bg-surface md:aspect-[1200/620]"
    >
      {project.thumbnail?.url && (
        <Image
          src={project.thumbnail.url}
          alt={project.title}
          fill
          sizes="(min-width: 1440px) 1200px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 40px)"
          className="object-cover"
        />
      )}
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-12">
      <div className="flex flex-col gap-4 md:max-w-[600px] md:gap-3">
        {project.context && <p className="text-label-m text-text-muted">{project.context}</p>}
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-h2 text-text md:text-h1 md:tracking-[-0.02em]">{project.title}</h2>
          <span aria-hidden="true" className="text-h3 text-text md:hidden">
            ↗
          </span>
        </div>
        <p className="text-body-m text-text-muted md:text-body-l">{project.shortDescription}</p>
      </div>

      <div className="flex flex-col gap-4 md:items-end md:gap-5">
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {project.technologies.map((tech) => (
            <li key={`${project.slug}-${tech.name}`}>
              <TechBadge name={tech.name} />
            </li>
          ))}
        </ul>
        {/* Stretched link: covers the whole card; its text is visible only from md. */}
        <Link
          href={`/projects/${project.slug}`}
          arrow
          className="text-label-m after:absolute after:inset-0 max-md:gap-0 max-md:[&>[data-arrow]]:hidden"
        >
          <span className="max-md:sr-only">{viewProjectLabel}</span>
        </Link>
      </div>
    </div>
  </article>
);
