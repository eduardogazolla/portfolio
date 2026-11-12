"use client";

import { Link } from "@/app/componentes/link";
import { Social } from "@/app/types/page-info";
import { getSocialLabel } from "@/app/utils/socials";

type FooterProps = {
  socials: Social[];
};

export const Footer = ({ socials }: FooterProps) => (
  <footer className="w-full border-t border-line px-5 pb-10 pt-7 lg:px-10 lg:py-8">
    <div className="mx-auto flex max-w-content flex-col-reverse items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-label-m text-text-muted">
        © {new Date().getFullYear()} Eduardo Gazolla
      </p>
      {socials.length > 0 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:gap-x-7">
          {socials.map((social) => (
            <li key={social.url}>
              <Link href={social.url} className="text-label-m">
                {getSocialLabel(social)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </footer>
);
