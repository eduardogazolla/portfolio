"use client";

import { Button } from "@/app/componentes/button";
import { Link } from "@/app/componentes/link";
import { CMSIcon } from "@/app/componentes/cms-icon";
import { RichText } from "@/app/componentes/rich-text";
import { TechBadge } from "@/app/componentes/tech-badge";
import { HomePageInfo } from "@/app/types/page-info";
import Image from "next/image";
import { HiArrowNarrowRight } from "react-icons/hi";
import { motion } from "motion/react";
import { useLanguage } from "@/app/componentes/context/language-context";

type HomeSectionProps = {
  homeInfo: HomePageInfo;
};

export const HeroSection = ({ homeInfo }: HomeSectionProps) => {
  const { translations } = useLanguage();

  const handleContact = () => {
    const constactSection = document.querySelector("#contact");
    if (constactSection) {
      constactSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="w-full lg:h-[755px] flex flex-col justify-end pb-10 sm:pb-32 py-32 lg:pb-[110px]">
      <div className="container flex items-start justify-between flex-col-reverse lg:flex-row">
        <motion.div
          className="w-full lg:max-w-[530px]"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-blue-400">{translations.hero.greeting}</p>
          <h1 className="text-4xl font-medium mt-2">Eduardo Gazolla</h1>

          <div className="text-gray-400 my-6 text-sm sm:text-base">
            <RichText content={homeInfo.introduction.raw} />
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-3 lg:max-w-[340px]">
            {homeInfo.technologies.map((tech) => (
              <TechBadge
                name={tech.name}
                key={`intro-tech-${tech.name}`}
              />
            ))}
          </div>
          <div className="mt-6 lg:mt-10 flex sm:items-center sm:gap-5 flex-col sm:flex-row">
            <Button className="w-max" onClick={handleContact}>
              {translations.hero.contactButton}
              <HiArrowNarrowRight size={18} />
            </Button>
            <div className="text-gray-600 text2xl flex items-center h-20 gap-3">
              {homeInfo.socials.map((contact, index) => (
                <Link
                  href={contact.url}
                  key={`contact-${index}`}
                  arrow={false}
                  className="hover:text-gray-100 transition-colors"
                >
                  <CMSIcon icon={contact.iconSvg} />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 200, scale: 0.5 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 200, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="origin-center"
        >
          <Image
            width={420}
            height={404}
            src={homeInfo.profilePicture.url}
            alt="Foto de perfil do Eduardo Gazolla"
            className="w-[300px] h-[300px] lg:w-[420px] lg:h-[404px] mb-6 lg:mb-0 shadow-2xl rounder-lg object-cover rounded-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
