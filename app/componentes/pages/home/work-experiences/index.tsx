"use client";

import { SectionTitle } from "@/app/componentes/section-title";
import { ExperienceItem } from "./experience-item";
import { WorkExperience as IWorkExperience } from "@/app/types/work-experience";
import { useLanguage } from "@/app/componentes/context/language-context";

type WorkExperienceProps = {
  experiences: IWorkExperience[];
};

export const WorkExperience = ({ experiences }: WorkExperienceProps) => {
  const { translations } = useLanguage();

  // Cria um novo array ordenado, do mais antigo para o mais recente
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA;
  });
  return (
    <section className="container py-16 flex gap-10 md:gap-4 lg:gap-16 flex-col md:flex-row">
      <div className="max-w-[420px]">
        <SectionTitle
          subtitle={translations.workExperience.subtitle}
          title={translations.workExperience.title}
        />
        <p className="text-gray-400 mt-6">
          {translations.workExperience.description}
        </p>
      </div>

      <div className="flex flex-col gap-4">
      {sortedExperiences.map((experience) => (
          <ExperienceItem
            key={experience.companyName}
            experience={experience}
          />
        ))}
      </div>
    </section>
  );
};