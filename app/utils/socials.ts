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

/** Link label: the CMS name, else a known-host label, else the bare domain. */
export const getSocialLabel = ({ name, url }: SocialLike): string => {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;

  let host: string;
  try {
    host = new URL(url).hostname.replace(/^(www|api)\./, '');
  } catch {
    return url;
  }
  return knownHosts[host] ?? host;
};
