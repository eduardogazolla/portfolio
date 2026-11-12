"use client";

import { useLanguage } from "@/app/componentes/context/language-context";

export const SkipLink = () => {
  const { translations } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-label-m focus:text-on-accent"
    >
      {translations.a11y.skipToContent}
    </a>
  );
};
