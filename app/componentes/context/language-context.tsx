"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  useEffect,
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
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

// Locale kept in memory when localStorage is unavailable (blocked or full), so
// the choice still applies for the current page session.
let memoryLocale: Locale | null = null;

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "pt-BR") return stored;
  } catch {
    // Storage unavailable: fall through to the in-memory or browser rule.
  }
  return null;
}

// Live snapshot reader for the store.
function readLocale(): Locale {
  if (typeof window === "undefined") return "pt-BR";

  const stored = readStoredLocale();
  if (stored) return stored;
  if (memoryLocale) return memoryLocale;

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
    readLocale,
    getServerSnapshot
  );

  const setLocale = useCallback((next: Locale) => {
    if (readLocale() === next) return;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      memoryLocale = next;
    }
    listeners.forEach((listener) => listener());
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(readLocale() === "pt-BR" ? "en" : "pt-BR");
  }, [setLocale]);

  // Keep <html lang> in step with the active locale, including the first
  // client render with a stored locale.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const translations = getTranslations(locale);

  return (
    <LanguageContext.Provider value={{ locale, translations, toggleLocale, setLocale }}>
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
