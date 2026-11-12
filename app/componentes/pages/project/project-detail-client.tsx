"use client";

import { ContactBand } from "@/app/componentes/contact-band";
import { useLanguage } from "@/app/componentes/context/language-context";
import { Link } from "@/app/componentes/link";
import { PageSection } from "@/app/componentes/page-section";
import { LocalizedProjectPageData } from "@/app/types/page-info";
import { pickLocale } from "@/app/utils/locale";
import { ProjectDetails } from "./project-details";
import { ProjectSections } from "./project-sections";

type ProjectDetailClientProps = {
  data: LocalizedProjectPageData;
};

export const ProjectDetailClient = ({ data }: ProjectDetailClientProps) => {
  const { locale, translations } = useLanguage();
  const { onlyOneNotice, backToAll } = translations.projectDetail;

  const project = pickLocale(data.ptProject, data.enProject, locale);

  return (
    <>
      <ProjectDetails project={project} />
      <ProjectSections sections={project.sections ?? []} />
      {data.totalProjects <= 1 && (
        <PageSection
          className="border-t border-line pb-16 pt-16 md:pb-[120px]"
          innerClassName="flex flex-col gap-4"
        >
          <p className="text-body-m text-text-muted">{onlyOneNotice}</p>
          <Link href="/projects" arrow className="text-label-m">
            {backToAll}
          </Link>
        </PageSection>
      )}
      <ContactBand />
    </>
  );
};
