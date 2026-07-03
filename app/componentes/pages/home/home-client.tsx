"use client";

import { useLanguage } from "@/app/componentes/context/language-context";
import { LocalizedHomePageData } from "@/app/types/page-info";
import { HeroSection } from "./hero-section";
import { KnownTechs } from "./known-techs";
import { HighlightedProjects } from "./highlighted-projects";
import { WorkExperience } from "./work-experiences";

type HomeClientProps = {
  data: LocalizedHomePageData;
};

export const HomeClient = ({ data }: HomeClientProps) => {
  const { locale } = useLanguage();

  const hasEnPage = !!(data.enPage && data.enPage.profilePicture && data.enPage.introduction);
  const pageDataRaw = locale === "en" && hasEnPage
    ? data.enPage
    : data.ptPage;

  const workExperiencesRaw = locale === "en" && data.enWorkExperiences && data.enWorkExperiences.length > 0
    ? data.enWorkExperiences
    : data.ptWorkExperiences;

  if (!pageDataRaw) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  // Deep copy to modify safely
  const pageData = {
    ...pageDataRaw,
    technologies: pageDataRaw.technologies?.map((tech, idx) => ({
      ...tech,
      name: tech.name || data.enPage?.technologies?.[idx]?.name || `Tech ${idx + 1}`,
    })) ?? [],
    knownTechs: pageDataRaw.knownTechs?.map((tech, idx) => ({
      ...tech,
      name: tech.name || data.enPage?.knownTechs?.[idx]?.name || `Tech ${idx + 1}`,
    })) ?? [],
    highlightProjects: pageDataRaw.highlightProjects?.map((project, pIdx) => {
      const enProject = data.enPage?.highlightProjects?.[pIdx];
      return {
        ...project,
        technologies: project.technologies?.map((tech, tIdx) => ({
          ...tech,
          name: tech.name || enProject?.technologies?.[tIdx]?.name || `Tech ${tIdx + 1}`,
        })) ?? [],
      };
    }) ?? [],
  };

  const workExperiences = workExperiencesRaw.map((exp, idx) => {
    const enExp = data.enWorkExperiences?.[idx];
    return {
      ...exp,
      technologies: exp.technologies?.map((tech, tIdx) => ({
        ...tech,
        name: tech.name || enExp?.technologies?.[tIdx]?.name || `Tech ${tIdx + 1}`,
      })) ?? [],
    };
  });

  return (
    <>
      <HeroSection homeInfo={pageData} />
      <KnownTechs techs={pageData.knownTechs} />
      <HighlightedProjects projects={pageData.highlightProjects} />
      <WorkExperience experiences={workExperiences} />
    </>
  );
};
