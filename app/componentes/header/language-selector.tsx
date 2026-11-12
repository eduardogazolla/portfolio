"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/app/componentes/context/language-context";
import { spring } from "@/app/lib/motion";
import { cn } from "@/app/lib/utils";
import type { Locale } from "@/app/utils/translations";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "pt-BR", label: "PT" },
  { locale: "en", label: "EN" },
];

export const LanguageSelector = () => {
  const { locale, setLocale, translations } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={translations.a11y.languageGroup}
      className="inline-flex items-center rounded-sm border border-line p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <button
            key={option.locale}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (!active) setLocale(option.locale);
            }}
            className={cn(
              "relative rounded-sm px-3 py-1 font-mono text-mono-s transition-colors duration-fast ease-out motion-reduce:transition-none",
              active ? "text-on-accent" : "text-text-muted hover:text-text"
            )}
          >
            {active && (
              <motion.span
                layoutId="language-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-sm bg-accent"
                transition={reduceMotion ? { duration: 0 } : spring.ui}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
