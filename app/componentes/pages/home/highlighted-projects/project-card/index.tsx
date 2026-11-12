import Image from "next/image";
import { Link } from "@/app/componentes/link";
import { TechBadge } from "@/app/componentes/tech-badge";
import type { Project } from "@/app/types/projects";

type ProjectCardProps = {
  project: Project;
  viewProjectLabel: string;
};

// Static layout for now; the scroll-linked version of this card is Part 6.
export const ProjectCard = ({ project, viewProjectLabel }: ProjectCardProps) => (
  <article className="flex flex-col gap-6 md:gap-8">
    <div aria-hidden={project.thumbnail?.url ? undefined : "true"} className="relative aspect-[5/3] w-full overflow-hidden rounded-md bg-surface md:aspect-[1200/620]">
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

    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
      <div className="flex flex-col gap-6 md:max-w-[600px] md:gap-4">
        <div className="flex flex-col gap-2">
          {project.context && (
            <p className="font-mono text-mono-s text-text-muted">{project.context}</p>
          )}
          <h3 className="font-display text-h2 text-text md:text-h1 md:tracking-[-0.02em]">{project.title}</h3>
        </div>
        <p className="text-body-m text-text-muted md:text-body-l">{project.shortDescription}</p>
      </div>

      <div className="flex flex-col gap-6 md:items-end md:gap-5">
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {project.technologies.map((tech) => (
            <li key={`${project.slug}-${tech.name}`}>
              <TechBadge name={tech.name} />
            </li>
          ))}
        </ul>
        <Link href={`/projects/${project.slug}`} arrow className="text-label-m">
          {viewProjectLabel}
        </Link>
      </div>
    </div>
  </article>
);
