"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
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

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Server and hydration render use "pt-BR"; the client then switches to the
// stored/browser locale without a hydration mismatch.
const getServerSnapshot = (): Locale => "pt-BR";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const locale = useSyncExternalStore(
    subscribe,
    getInitialLocale,
    getServerSnapshot
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    const next: Locale = getInitialLocale() === "pt-BR" ? "en" : "pt-BR";
    localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
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
