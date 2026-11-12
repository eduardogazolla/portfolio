"use client";

import { PageSection } from "@/app/componentes/page-section";
import { SectionTitle } from "@/app/componentes/section-title";
import { KnowTech } from "./known-tech";
import { KnownTech as IKnownTech } from "@/app/types/projects";
import { useLanguage } from "@/app/componentes/context/language-context";

type KnownTechsProps = {
  techs: IKnownTech[];
};

export const KnownTechs = ({ techs }: KnownTechsProps) => {
  const { translations } = useLanguage();

  // Oldest first. ISO dates compare correctly as plain strings.
  const sorted = [...(techs ?? [])].sort((a, b) =>
    a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0
  );

  return (
    <PageSection id="stack" className="pt-28 md:py-[120px]">
      <SectionTitle
        title={translations.stack.title}
        subtitle={translations.stack.subtitle}
        className="md:flex-row md:items-end md:justify-between"
        subtitleClassName="md:text-body-l"
      />
      <ul className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
        {sorted.map((tech) => (
          <KnowTech key={tech.name} tech={tech} />
        ))}
      </ul>
    </PageSection>
  );
};
