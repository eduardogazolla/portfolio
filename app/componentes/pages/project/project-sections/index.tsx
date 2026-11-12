"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { PageSection } from "@/app/componentes/page-section";
import { duration, ease } from "@/app/lib/motion";
import { ProjectSection } from "@/app/types/projects";

type ProjectSectionsProps = {
  sections: ProjectSection[];
};

// Figma 9:291 (desktop) / 11:456 (mobile). Under reduced motion the images stay at full size.
export const ProjectSections = ({ sections }: ProjectSectionsProps) => {
  const reduceMotion = useReducedMotion();

  if (sections.length === 0) return null;

  return (
    <PageSection className="pb-14 md:pb-[120px]" innerClassName="flex flex-col gap-12 md:gap-24">
      {sections.map((section, i) => (
        <div key={`${i}-${section.title}`} className="flex flex-col gap-4 md:gap-6">
          <h2 className="font-display text-h3 text-text md:text-h2">{section.title}</h2>
          {section.image?.url && (
            <motion.div
              className="relative aspect-[350/220] overflow-hidden rounded-[12px] bg-surface md:aspect-[1200/640] md:rounded-md"
              initial={reduceMotion ? false : { scale: 0.96 }}
              whileInView={reduceMotion ? undefined : { scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: duration.slow, ease: ease.out }}
            >
              <Image
                src={section.image.url}
                alt={section.title}
                fill
                sizes="(min-width: 1280px) 1200px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 40px)"
                className="object-cover"
              />
            </motion.div>
          )}
        </div>
      ))}
    </PageSection>
  );
};
