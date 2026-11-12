"use client";

import NextLink from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";
import { NewTabHint } from "./new-tab-hint";
import { isExternalUrl, isSchemeUrl } from "@/app/lib/url";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Show the ↗ arrow. Defaults to true for external links. */
  arrow?: boolean;
};

export const Link = ({ className, children, href, target, rel, arrow, ...props }: LinkProps) => {
  const external = isExternalUrl(href) || target === "_blank";
  const showArrow = arrow ?? external;

  const classes = cn(
    "group inline-flex items-center gap-2 text-body-m text-text duration-fast ease-out",
    "[@media(hover:hover)_and_(pointer:fine)]:hover:text-accent",
    className
  );

  const content = (
    <>
      {children}
      {external && <NewTabHint />}
      {showArrow && (
        <span
          data-arrow
          aria-hidden="true"
          className={cn(
            "inline-block transition-transform duration-fast ease-out",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-[2px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-[2px]",
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

  if (isSchemeUrl(href)) {
    return (
      <a href={href} target={target} rel={rel} className={classes} {...props}>
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
