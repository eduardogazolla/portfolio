"use client";

import { cn } from "@/app/lib/utils";
import { useLanguage } from "@/app/componentes/context/language-context";

export const ALL_FILTER = "all";

type TechFilterProps = {
  techs: string[];
  value: string;
  onChange: (value: string) => void;
};

export const TechFilter = ({ techs, value, onChange }: TechFilterProps) => {
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
