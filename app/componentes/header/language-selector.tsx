"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { motion } from "framer-motion";

export const LanguageSelector = () => {
  const { locale, toggleLocale } = useLanguage();

  return (
    <motion.button
      onClick={toggleLocale}
      className="flex items-center gap-1 text-sm font-mono text-gray-400 hover:text-gray-50 transition-colors bg-gray-800/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50 hover:border-blue-500/50"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      title={locale === "pt-BR" ? "Switch to English" : "Mudar para Português"}
    >
      <motion.span
        key={locale}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-blue-400 font-medium"
      >
        {locale === "pt-BR" ? "PT" : "EN"}
      </motion.span>
      <span className="text-gray-600">/</span>
      <span className="text-gray-500">
        {locale === "pt-BR" ? "EN" : "PT"}
      </span>
    </motion.button>
  );
};
