"use client";

import { Link } from "@/app/componentes/link";
import { SectionTitle } from "@/app/componentes/section-title";
import { motion } from "framer-motion";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useLanguage } from "@/app/componentes/context/language-context";

export const PageIntroduction = () => {
  const { translations } = useLanguage();

  return (
    <section className="w-full h-[450px] lg:h-[630px] bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-2">
      <SectionTitle
        subtitle={translations.projectsPage.subtitle}
        title={translations.projectsPage.title}
        className="text-center items-center [&>h3]:text-4xl"
      />

      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-400 text-center max-w-[640px] my-6 text-sm sm:text-base">
          {translations.projectsPage.description}
        </p>
        <Link href={"/"}>
          <HiArrowNarrowLeft size={20} />
          {translations.projectsPage.backToHome}
        </Link>
      </motion.div>
    </section>
  );
};
