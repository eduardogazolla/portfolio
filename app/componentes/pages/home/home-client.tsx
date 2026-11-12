"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedHomePageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { getCurrentExperience } from "@/app/utils/experience";
import { HeroSection } from "./hero-section";
import { KnownTechs } from "./known-techs";
import { HighlightedProjects } from "./highlighted-projects";
import { WorkExperience } from "./work-experiences";
import { ContactForm } from "@/app/componentes/contact-form";

type HomeClientProps = {
  data: LocalizedHomePageData;
};

export const HomeClient = ({ data }: HomeClientProps) => {
  const { locale } = useLanguage();

  const base = data.ptPage ?? data.enPage;
  if (!base) return null;
  const pageData = pickLocale(base, data.enPage, locale);

  const workExperiences = pickLocale(
    data.ptWorkExperiences,
    data.enWorkExperiences,
    locale
  );

  return (
    <>
      <HeroSection
        homeInfo={pageData}
        currentExperience={getCurrentExperience(workExperiences)}
      />
      <KnownTechs techs={pageData.knownTechs} />
      <HighlightedProjects projects={pageData.highlightProjects} socials={pageData.socials} />
      <WorkExperience experiences={workExperiences} />
      <ContactForm />
    </>
  );
};
