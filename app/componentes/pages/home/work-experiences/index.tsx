"use client";

import { PageSection } from "@/app/componentes/page-section";
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
    <PageSection id="experience" className="pt-28 md:pt-10 md:pb-40">
      <SectionTitle
        title={translations.experience.sectionTitle}
        subtitle={
          <>
            <span className="md:hidden">{translations.experience.subtitleShort}</span>
            <span className="hidden md:inline">{translations.experience.subtitle}</span>
          </>
        }
        className="lg:flex-row lg:items-end lg:justify-between lg:gap-12"
        subtitleClassName="md:text-body-l lg:max-w-[600px]"
      />
      <div className="mt-4 md:mt-14">
        {experiences.map((experience) => (
          <ExperienceItem
            key={`${experience.companyName}-${experience.startDate}`}
            experience={experience}
            isCurrent={experience === current}
          />
        ))}
      </div>
    </PageSection>
  );
};
