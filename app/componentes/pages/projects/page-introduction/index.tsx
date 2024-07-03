"use client";

import { Link } from "@/app/componentes/link";
import { SectionTitle } from "@/app/componentes/section-title";
import { motion } from "framer-motion";
import { HiArrowNarrowLeft } from "react-icons/hi";

export const PageIntroduction = () => {
  return (
    <section className="w-full h-[450px] lg:h-[630px] bg-hero-image bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-2">
      <SectionTitle
        subtitle="projetos"
        title="Meus projetos"
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
          Aqui você poderá ver alguns dos trabalhos que desenvolvi e estou
          desevolvendo. Fique à vontade para ver todos os meus projetos, como
          foram criados, as tecnologias usadas neles e as funcionalidades que
          cada um tem.
        </p>
        <Link href={"/"}>
          <HiArrowNarrowLeft size={20} />
          Voltar para Home
        </Link>
      </motion.div>
    </section>
  );
};
