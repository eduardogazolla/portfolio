"use client";

import Link from "next/link";
import Image from "next/image";
import { NavItem } from "./nav-item";
import { LanguageSelector } from "./language-selector";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/componentes/context/language-context";

export const Header = () => {
  const { translations } = useLanguage();

  const NAV_ITEMS = [
    {
      label: translations.header.home,
      href: "/",
    },
    {
      label: translations.header.projects,
      href: "/projects",
    },
  ];

  return (
    <motion.header
      className="absolute top-0 w-full z-10 h-24 flex items-center justify-center"
      initial={{ top: -100 }}
      animate={{ top: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image
            width={58}
            height={49}
            src="/images/logo.svg"
            alt="Logo Eduardo Gazolla Dev"
          />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-10">
            {NAV_ITEMS.map((item) => (
              <NavItem {...item} key={item.label} />
            ))}
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </motion.header>
  );
};
