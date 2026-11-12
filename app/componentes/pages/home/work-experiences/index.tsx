"use client";

import { SectionTitle } from "@/app/componentes/section-title";
import { ExperienceItem } from "./experience-item";
import { WorkExperience as IWorkExperience } from "@/app/types/work-experience";
import { useLanguage } from "@/app/componentes/context/language-context";
import { getCurrentExperience } from "@/app/utils/experience";

type WorkExperienceProps = {
  /** Already ordered by startDate descending (most recent first) by the query. */
  experiences: IWorkExperience[];
};

export const WorkExperience = ({ experiences }: WorkExperienceProps) => {
  const { translations } = useLanguage();
  const current = getCurrentExperience(experiences);

  return (
    <section id="experience" className="container pt-28 md:pt-10 md:pb-40">
      <SectionTitle
        title={translations.experience.sectionTitle}
        subtitle={translations.experience.subtitle}
        className="md:flex-row md:items-end md:justify-between md:gap-12"
        subtitleClassName="md:max-w-[600px] md:text-body-l"
      />
      <div className="mt-8 md:mt-14">
        {experiences.map((experience) => (
          <ExperienceItem
            key={`${experience.companyName}-${experience.startDate}`}
            experience={experience}
            isCurrent={experience === current}
          />
        ))}
      </div>
    </section>
  );
};
