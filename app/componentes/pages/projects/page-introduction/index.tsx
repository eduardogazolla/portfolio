"use client";

import type { ReactNode } from "react";
import { PageSection } from "@/app/componentes/page-section";
import { PageTitle } from "@/app/componentes/page-title";
import { useLanguage } from "@/app/componentes/context/language-context";

type PageIntroductionProps = {
  /** Project counter ("N projetos"), shown beside the title in list mode only. */
  count?: number;
  /** Tech filter, shown below the description in list mode only. */
  children?: ReactNode;
};

export const PageIntroduction = ({ count, children }: PageIntroductionProps) => {
  const { translations } = useLanguage();

  return (
    <PageSection className="pb-10 pt-10 md:pb-16 md:pt-20" innerClassName="flex flex-col gap-5 md:gap-8">
      <div className="flex items-end justify-between gap-6">
        <PageTitle title={translations.projectsPage.title} />
        {count !== undefined && (
          <p aria-live="polite" className="shrink-0 text-label-m text-text-muted">
            {translations.projectsSection.projectsCount(count)}
          </p>
        )}
      </div>
      <p className="max-w-[640px] text-body-m text-text-muted md:text-body-l">
        {translations.projectsPage.description}
      </p>
      {children}
    </PageSection>
  );
};
