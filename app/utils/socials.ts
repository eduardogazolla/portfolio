type SocialLike = {
  name?: string | null;
  url: string;
};

const knownHosts: Record<string, string> = {
  'github.com': 'GitHub',
  'linkedin.com': 'LinkedIn',
  'whatsapp.com': 'WhatsApp',
  'wa.me': 'WhatsApp',
};

const parseHostname = (url: string): string => {
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(url);
  const candidates = hasScheme ? [url] : [url, `https://${url}`];
  for (const candidate of candidates) {
    try {
      const host = new URL(candidate).hostname;
      if (host) return host;
    } catch {
      // try the next candidate
    }
  }
  return '';
};

const parseHost = (url: string): string => parseHostname(url).replace(/^(www|api)\./, '');

/** True only when the URL's host is github.com (or www.github.com), not when it merely mentions it. */
export const isGitHubSocial = ({ url }: SocialLike): boolean => {
  const host = parseHostname(url);
  return host === 'github.com' || host === 'www.github.com';
};

/** True when the URL's host is linkedin.com or one of its subdomains (www., br., ...). */
export const isLinkedInSocial = ({ url }: SocialLike): boolean => {
  const host = parseHostname(url);
  return host === 'linkedin.com' || host.endsWith('.linkedin.com');
};

/** Link label: the CMS name, else a known-host label, else the bare domain. */
export const getSocialLabel = ({ name, url }: SocialLike): string => {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;

  const host = parseHost(url);
  if (!host) return url;

  const known = Object.keys(knownHosts).find(
    (candidate) => host === candidate || host.endsWith(`.${candidate}`),
  );
  return known ? knownHosts[known] : host;
};
