"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { Button } from "@/app/componentes/button";
import { SocialLinks } from "@/app/componentes/social-links";
import { RichText } from "@/app/componentes/rich-text";
import { useLanguage } from "@/app/componentes/context/language-context";
import { HomePageInfo } from "@/app/types/page-info";
import { WorkExperience } from "@/app/types/work-experience";
import { HeroIntro } from "./hero-intro";

type HeroSectionProps = {
  /** CMS page data; null when it failed to load (the shell still renders). */
  homeInfo: HomePageInfo | null;
  /** The open experience, or null when there is none (hides the "Agora:" line). */
  currentExperience: WorkExperience | null;
};

const FIRST_NAME = "Eduardo";
const LAST_NAME = "Gazolla";

// Hooks for the intro animation (hero-intro.tsx, initial states in globals.css):
// every animatable piece carries a data-hero attribute.
export const HeroSection = ({ homeInfo, currentExperience }: HeroSectionProps) => {
  const { translations } = useLanguage();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const profilePictureUrl = homeInfo?.profilePicture?.url;

  const handleContact = () => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    contact.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
    contact
      .querySelector<HTMLElement>("input, textarea, select")
      ?.focus({ preventScroll: true });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full px-5 pb-16 pt-8 md:pt-14 lg:px-10 lg:pb-[118px]"
    >
      <HeroIntro rootRef={sectionRef} />
      <div className="mx-auto grid w-full max-w-content lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col">
          {homeInfo?.role && (
            <p data-hero="role" className="text-label-m text-text-muted">
              {homeInfo.role}
            </p>
          )}

          <h1
            data-hero="name"
            className="relative -ml-1 mt-4 font-display text-display-xl tracking-[-0.04em] text-text [font-size:clamp(64px,26vw,104px)] md:[font-size:clamp(64px,22vw,168px)] lg:-ml-3 lg:mt-7 lg:[font-size:clamp(64px,calc((100vw-480px)/3.5),232px)]"
          >
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span data-hero="name-line" className="block">
                {FIRST_NAME}
              </span>
            </span>{" "}
            {/* Outline target: flow-root keeps the mask's -mb inside, so it hugs the glyph box. */}
            <span data-hero="name-last" className="relative flow-root w-fit">
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span data-hero="name-line" className="block">
                  {LAST_NAME}
                </span>
              </span>
            </span>
          </h1>

          {homeInfo?.introduction?.raw && (
            <div data-hero="bio" className="mt-6 max-w-[560px] text-body-m text-text-muted lg:mt-11 lg:text-body-l">
              <RichText content={homeInfo.introduction.raw} />
            </div>
          )}

          <div data-hero="actions" className="mt-6 flex flex-wrap gap-3 lg:mt-10">
            <Button onClick={handleContact} className="px-7 py-4">
              {translations.contactVoice.primaryButton}
            </Button>
            <Button href="/projects" variant="secondary" className="px-7 py-4">
              {translations.hero.viewProjects}
            </Button>
          </div>
        </div>

        <div className="mt-6 flex min-w-0 flex-col lg:mt-0 lg:pt-12">
          {profilePictureUrl && (
            <div
              data-hero="photo"
              className="relative aspect-[350/400] w-full overflow-hidden rounded-md lg:aspect-auto lg:h-[480px]"
            >
              <Image
                src={profilePictureUrl}
                alt={translations.hero.photoAlt}
                fill
                priority
                sizes="(min-width: 1024px) 400px, calc(100vw - 40px)"
                className="object-cover"
              />
            </div>
          )}

          {currentExperience && (
            <p data-hero="status" className="mt-5 flex items-center gap-2.5 text-label-m text-text-muted">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
              {`${translations.hero.nowPrefix} ${currentExperience.role} ${translations.hero.nowAt} ${currentExperience.companyName}`}
            </p>
          )}

          <SocialLinks
            socials={homeInfo?.socials ?? []}
            data-hero="socials"
            className="mt-6 gap-x-6 gap-y-2 lg:mt-auto lg:gap-x-7 lg:pb-5 lg:pt-8"
          />
        </div>
      </div>
    </section>
  );
};
