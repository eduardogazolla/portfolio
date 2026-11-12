"use client";

import { useLanguage } from "@/app/componentes/context/language-context";

export const NewTabHint = () => {
  const { translations } = useLanguage();
  return <span className="sr-only">{translations.a11y.opensInNewTab}</span>;
};
