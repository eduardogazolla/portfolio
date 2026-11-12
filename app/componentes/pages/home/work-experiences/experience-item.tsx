"use client";

import { useId, useState } from "react";
import { Link } from "@/app/componentes/link";
import { RichText } from "@/app/componentes/rich-text";
import { TechBadge } from "@/app/componentes/tech-badge";
import { useLanguage } from "@/app/componentes/context/language-context";
import { cn } from "@/app/lib/utils";
import { WorkExperience } from "@/app/types/work-experience";
import { formatDuration, formatPeriod } from "@/app/utils/experience";

type ExperienceItemProps = {
  experience: WorkExperience;
  isCurrent: boolean;
};

const Badges = ({ technologies }: Pick<WorkExperience, "technologies">) => (
  <ul className="flex flex-wrap gap-2">
    {technologies.map((tech) => (
      <li key={tech.name}>
        <TechBadge name={tech.name} />
      </li>
    ))}
  </ul>
);

const Description = ({ description }: Pick<WorkExperience, "description">) =>
  description ? (
    <div className="max-w-[600px] text-body-m text-text-muted">
      <RichText content={description.raw} />
    </div>
  ) : null;

const CurrentExperience = ({ experience }: { experience: WorkExperience }) => {
  const { locale, translations } = useLanguage();
  const { startDate, endDate, role, companyName, companyUrl, technologies, description } =
    experience;

  return (
    <article className="flex flex-col gap-3 border-t border-line pb-8 pt-7 md:flex-row md:gap-12 md:py-10">
      <div className="flex flex-wrap items-center gap-x-2 md:w-[240px] md:shrink-0 md:flex-col md:items-start md:gap-y-1.5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" data-pulse-dot className="relative size-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
            <span className="absolute inset-0 rounded-full bg-accent" />
          </span>
          <span className="text-label-m text-text">
            {formatPeriod(startDate, endDate, locale, translations.experience.current)}
          </span>
        </div>
        <span className="text-label-m text-text-muted md:text-body-m">
          {formatDuration(startDate, endDate, translations.experience.duration)}
        </span>
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="font-display text-h3 text-text">{role}</h3>
        {companyUrl ? (
          <Link href={companyUrl} className="gap-1.5 text-label-m text-text-muted">
            {companyName}
          </Link>
        ) : (
          <span className="text-label-m text-text-muted">{companyName}</span>
        )}
        <Description description={description} />
        {technologies.length > 0 && <Badges technologies={technologies} />}
      </div>
    </article>
  );
};

const PreviousExperience = ({ experience }: { experience: WorkExperience }) => {
  const { locale, translations } = useLanguage();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { startDate, endDate, role, companyName, technologies, description } = experience;

  const period = formatPeriod(startDate, endDate, locale, translations.experience.current);
  const hasDetails = Boolean(description) || technologies.length > 0;
  const toggleLabel = `${
    open ? translations.experience.hideDetails : translations.experience.showDetails
  }: ${role}`;

  return (
    <article className="border-t border-line">
      <div className="flex items-center gap-3 py-5 md:gap-12 md:py-6">
        <span className="hidden text-label-m text-text-muted md:block md:w-[240px] md:shrink-0">
          {period}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-3.5">
          <h3 className="font-display text-label-m text-text md:text-h3">{role}</h3>
          <p className="text-label-m text-text-muted">
            <span>{companyName}</span>
            <span className="md:hidden">
              <span aria-hidden="true"> · </span>
              {period}
            </span>
          </p>
        </div>
        <span className="hidden text-label-m text-text-muted md:block">
          {formatDuration(startDate, endDate, translations.experience.duration)}
        </span>
        {hasDetails && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={toggleLabel}
            onClick={() => setOpen((value) => !value)}
            className="-mr-3 flex size-11 shrink-0 items-center justify-center text-text"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className={cn(
                "size-5 transition-transform duration-base ease-in-out motion-reduce:transition-none",
                open && "rotate-45"
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M10 3v14M3 10h14" />
            </svg>
          </button>
        )}
      </div>

      {hasDetails && (
        <div
          id={panelId}
          inert={!open}
          className={cn(
            "grid transition-[grid-template-rows] duration-base ease-in-out motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col items-start gap-4 pb-6 md:pl-[288px]">
              <Description description={description} />
              {technologies.length > 0 && <Badges technologies={technologies} />}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export const ExperienceItem = ({ experience, isCurrent }: ExperienceItemProps) =>
  isCurrent ? (
    <CurrentExperience experience={experience} />
  ) : (
    <PreviousExperience experience={experience} />
  );
