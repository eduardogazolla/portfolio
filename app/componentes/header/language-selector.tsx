"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/app/componentes/context/language-context";
import { spring } from "@/app/lib/motion";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";
import { cn } from "@/app/lib/utils";
import type { Locale } from "@/app/utils/translations";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "pt-BR", label: "PT" },
  { locale: "en", label: "EN" },
];

export const LanguageSelector = () => {
  const { locale, setLocale, translations } = useLanguage();
  const reduceMotion = usePrefersReducedMotion();
  // Per-instance id so several switches on a page never share one pill.
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label={translations.a11y.languageGroup}
      className="inline-flex items-center gap-0.5 rounded-full border border-line p-1"
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
              "relative rounded-full px-3 py-1.5 text-label-m transition-colors duration-fast ease-out motion-reduce:transition-none",
              active ? "text-on-accent" : "text-text-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-text"
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-text"
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
