"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedHomePageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { HeroSection } from "./hero-section";
import { KnownTechs } from "./known-techs";
import { HighlightedProjects } from "./highlighted-projects";
import { WorkExperience } from "./work-experiences";

type HomeClientProps = {
  data: LocalizedHomePageData;
};

export const HomeClient = ({ data }: HomeClientProps) => {
  const { locale } = useLanguage();

  const pageData = data.ptPage
    ? pickLocale(data.ptPage, data.enPage, locale)
    : null;

  if (!pageData) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const workExperiences = pickLocale(
    data.ptWorkExperiences,
    data.enWorkExperiences,
    locale
  );

  return (
    <>
      <HeroSection homeInfo={pageData} />
      <KnownTechs techs={pageData.knownTechs} />
      <HighlightedProjects projects={pageData.highlightProjects} />
      <WorkExperience experiences={workExperiences} />
    </>
  );
};
