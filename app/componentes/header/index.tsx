"use client";

import Link from "next/link";
import { NavItem } from "./nav-item";
import { LanguageSelector } from "./language-selector";
import { MobileMenu } from "./mobile-menu";
import { useLanguage } from "@/app/componentes/context/language-context";
import type { Social } from "@/app/types/page-info";

type HeaderProps = {
  socials: Social[];
};

export const Header = ({ socials }: HeaderProps) => {
  const { translations } = useLanguage();

  const NAV_ITEMS = [
    { label: translations.header.home, href: "/" },
    { label: translations.header.projects, href: "/projects" },
    { label: translations.contactVoice.menuLabel, href: "/#contact" },
  ];

  return (
    // Sticky, not fixed or animated: it keeps its place in the flow (Figma Nav: 98 px desktop,
    // 86 px mobile) and the menu stays reachable after scrolling.
    <header className="sticky top-0 z-40 w-full bg-bg px-5 py-4 md:py-7 lg:px-10">
      <div className="mx-auto flex max-w-content items-center justify-between">
        <Link href="/" className="min-w-0 truncate text-label-m text-text">
          Eduardo Gazolla
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-8">
          <nav
            aria-label={translations.a11y.mainNavigation}
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavItem {...item} key={item.href} />
            ))}
          </nav>
          <LanguageSelector />
          <MobileMenu socials={socials} />
        </div>
      </div>
    </header>
  );
};
