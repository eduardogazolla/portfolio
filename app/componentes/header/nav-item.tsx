"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentPath } from "@/app/lib/nav";
import { cn } from "@/app/lib/utils";

type NavItemProps = {
  label: string;
  href: string;
};

export const NavItem = ({ label, href }: NavItemProps) => {
  const isActive = isCurrentPath(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-2 text-label-m text-text-muted transition-colors duration-fast ease-out motion-reduce:transition-none",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:text-text",
        isActive && "text-text"
      )}
    >
      {isActive && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      )}
      {label}
    </Link>
  );
};
