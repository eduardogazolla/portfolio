/** Whether `href` is the current page. A section's children (`/projects/<slug>`) keep it current. */
export const isCurrentPath = (pathname: string | null, href: string): boolean => {
  if (!pathname || href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};
