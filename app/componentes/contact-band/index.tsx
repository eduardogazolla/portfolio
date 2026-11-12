"use client";

import { Button } from "@/app/componentes/button";
import { useLanguage } from "@/app/componentes/context/language-context";
import { PageSection } from "@/app/componentes/page-section";

// Closing call to action shared by /projects and the project detail (FR-007).
// Figma 9:203 / 9:306 (desktop) and 11:463 (mobile).
export const ContactBand = () => {
  const { translations } = useLanguage();
  const { title, bandDescription, bandButton } = translations.contactVoice;

  return (
    <PageSection
      className="border-t border-line py-16 md:py-24"
      innerClassName="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-12"
    >
      <div className="flex flex-col gap-5 md:gap-4">
        <h2 className="font-display text-[56px] font-extrabold leading-[0.92] tracking-[-0.03em] text-text md:text-[88px]">
          {title}
        </h2>
        <p className="text-body-m text-text-muted md:text-body-l">{bandDescription}</p>
      </div>
      <Button href="/#contact" className="w-full px-7 py-4 md:w-auto md:shrink-0">
        {bandButton}
      </Button>
    </PageSection>
  );
};
