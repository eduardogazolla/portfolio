"use client";

import { KnownTech } from "@/app/types/projects";
import { useLanguage } from "@/app/componentes/context/language-context";

type KnownTechProps = {
  tech: KnownTech;
};

export const KnowTech = ({ tech }: KnownTechProps) => {
  const { translations } = useLanguage();
  // startDate is an ISO date (YYYY-MM-DD): slice avoids timezone shifts.
  const year = tech.startDate.slice(0, 4);

  return (
    <li className="flex items-center justify-between gap-4 border-t border-line py-3 md:py-5">
      <span className="font-display text-label-m font-semibold text-text md:text-h3">
        {tech.name}
      </span>
      <span className="shrink-0 text-label-m text-text-muted">
        {translations.stack.since} {year}
      </span>
    </li>
  );
};
