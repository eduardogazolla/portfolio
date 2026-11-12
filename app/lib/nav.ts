export type NavCurrent = "page" | "true" | undefined;

/**
 * `aria-current` value for a nav link: "page" on an exact match, "true" when the link's section
 * contains the current page (`/projects/<slug>` keeps Projects current), undefined otherwise.
 */
export const getNavCurrent = (pathname: string | null, href: string): NavCurrent => {
  if (!pathname || href.includes("#")) return undefined;
  if (pathname === href) return "page";
  if (href !== "/" && pathname.startsWith(`${href}/`)) return "true";
  return undefined;
};
