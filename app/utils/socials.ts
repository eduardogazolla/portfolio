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

const parseHost = (url: string): string => {
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(url);
  const candidates = hasScheme ? [url] : [url, `https://${url}`];
  for (const candidate of candidates) {
    try {
      const host = new URL(candidate).hostname;
      if (host) return host.replace(/^(www|api)\./, '');
    } catch {
      // try the next candidate
    }
  }
  return '';
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
