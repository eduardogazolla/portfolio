"use client";

import NextLink from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";
import { useLanguage } from "@/app/componentes/context/language-context";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Show the ↗ arrow. Defaults to true for external links. */
  arrow?: boolean;
};

const isExternalUrl = (href: string) => /^https?:\/\//i.test(href);

const hoverFinePointer = "[@media(hover:hover)_and_(pointer:fine)]";

export const Link = ({ className, children, href, target, rel, arrow, ...props }: LinkProps) => {
  const { translations } = useLanguage();
  const external = isExternalUrl(href) || target === "_blank";
  const showArrow = arrow ?? external;

  const classes = cn(
    "group inline-flex items-center gap-2 text-body-m text-text transition-colors duration-fast ease-out",
    `${hoverFinePointer}:hover:text-accent`,
    className
  );

  const content = (
    <>
      {children}
      {external && <span className="sr-only">{translations.a11y.opensInNewTab}</span>}
      {showArrow && (
        <span
          data-arrow
          aria-hidden="true"
          className={cn(
            "inline-block transition-transform duration-fast ease-out",
            `${hoverFinePointer}:group-hover:translate-x-[2px] ${hoverFinePointer}:group-hover:-translate-y-[2px]`,
            "motion-reduce:transform-none"
          )}
        >
          ↗
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} target={target} rel={rel} className={classes} {...props}>
      {content}
    </NextLink>
  );
};
