"use client";

import type { Ref } from "react";
import { cn } from "@/app/lib/utils";
import { useLanguage } from "@/app/componentes/context/language-context";

export const ALL_FILTER = "all";

type TechFilterProps = {
  techs: string[];
  value: string;
  onChange: (value: string) => void;
  /** Ref to the "all" button, so callers can move focus back to it. */
  allRef?: Ref<HTMLButtonElement>;
};

export const TechFilter = ({ techs, value, onChange, allRef }: TechFilterProps) => {
  const { translations } = useLanguage();
  const options = [
    { value: ALL_FILTER, label: translations.projectsSection.filterAll },
    ...techs.map((tech) => ({ value: tech, label: tech })),
  ];

  return (
    <div role="group" aria-label={translations.projectsSection.filterLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={option.value === ALL_FILTER ? allRef : undefined}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-label-m transition-colors duration-fast ease-out",
              active
                ? "border-accent text-text"
                : "border-line text-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:border-text [@media(hover:hover)_and_(pointer:fine)]:hover:text-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
