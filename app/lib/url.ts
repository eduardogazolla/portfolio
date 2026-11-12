/** http(s) and protocol-relative URLs leave the site and open in a new tab. */
export const isExternalUrl = (href: string) => /^(https?:)?\/\//i.test(href);

/** mailto:, tel: and similar schemes: plain anchors, never next/link, no new tab. */
export const isSchemeUrl = (href: string) =>
  /^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href);
