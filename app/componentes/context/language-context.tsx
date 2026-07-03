"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Locale,
  TranslationDictionary,
  getTranslations,
} from "@/app/utils/translations";

const STORAGE_KEY = "portfolio-gazolla:locale";

type LanguageContextProps = {
  locale: Locale;
  translations: TranslationDictionary;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt-BR";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "pt-BR") return stored;

  const browserLang = navigator.language;
  if (browserLang.startsWith("pt")) return "pt-BR";
  return "en";
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("pt-BR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocale(getInitialLocale());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale, mounted]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "pt-BR" ? "en" : "pt-BR"));
  }, []);

  const translations = getTranslations(locale);

  return (
    <LanguageContext.Provider value={{ locale, translations, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
