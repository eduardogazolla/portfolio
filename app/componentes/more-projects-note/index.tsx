"use client";

import type { ReactNode } from "react";
import { Link } from "@/app/componentes/link";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Social } from "@/app/types/page-info";
import { getSocialLabel, isGitHubSocial } from "@/app/utils/socials";
import { cn } from "@/app/lib/utils";

type MoreProjectsNoteProps = {
  socials: Social[];
  /** Page-specific spacing and border. */
  className?: string;
  /** Extra links rendered before the GitHub link. */
  children?: ReactNode;
};

// Figma 9:196 / 6:134: "More projects coming" note with a GitHub link, shared by Home and Projects.
export const MoreProjectsNote = ({ socials, className, children }: MoreProjectsNoteProps) => {
  const { translations } = useLanguage();
  const github = socials?.find(isGitHubSocial);

  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-center md:gap-4", className)}>
      <p className="text-body-m text-text-muted">{translations.projectsSection.moreComing}</p>
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        {children}
        {github && (
          <Link href={github.url} className="text-label-m">
            {getSocialLabel(github)}
          </Link>
        )}
      </div>
    </div>
  );
};
