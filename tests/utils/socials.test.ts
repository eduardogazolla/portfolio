import { getSocialLabel, isGitHubSocial } from '@/app/utils/socials';

describe('getSocialLabel', () => {
  it('uses the trimmed name', () => {
    expect(
      getSocialLabel({ name: '  Meu GitHub ', url: 'https://x.com/a' }),
    ).toBe('Meu GitHub');
  });

  it.each([
    ['https://github.com/user', 'GitHub'],
    ['https://www.github.com/user', 'GitHub'],
    ['https://www.linkedin.com/in/user', 'LinkedIn'],
    ['https://api.whatsapp.com/send?phone=1', 'WhatsApp'],
    ['https://wa.me/5511', 'WhatsApp'],
  ])('maps %s to %s when name is missing', (url, label) => {
    expect(getSocialLabel({ url })).toBe(label);
    expect(getSocialLabel({ name: '   ', url })).toBe(label);
    expect(getSocialLabel({ name: null, url })).toBe(label);
  });

  it('falls back to the domain without www./api.', () => {
    expect(getSocialLabel({ url: 'https://www.example.com/x' })).toBe(
      'example.com',
    );
    expect(getSocialLabel({ url: 'https://api.foo.dev/x' })).toBe('foo.dev');
  });

  it('handles urls without a protocol', () => {
    expect(getSocialLabel({ url: 'github.com/user' })).toBe('GitHub');
    expect(getSocialLabel({ url: 'www.example.com/x' })).toBe('example.com');
  });

  it('matches known hosts on subdomains only at a dot boundary', () => {
    expect(getSocialLabel({ url: 'https://gist.github.com/x' })).toBe('GitHub');
    expect(getSocialLabel({ url: 'https://br.linkedin.com/in/x' })).toBe(
      'LinkedIn',
    );
    expect(getSocialLabel({ url: 'https://notgithub.com/x' })).toBe(
      'notgithub.com',
    );
  });

  it('returns the url for schemes without a host', () => {
    expect(getSocialLabel({ url: 'mailto:me@example.com' })).toBe(
      'mailto:me@example.com',
    );
    expect(getSocialLabel({ url: 'tel:+5511999999999' })).toBe(
      'tel:+5511999999999',
    );
  });

  it('returns the url for a blank name and an invalid url', () => {
    expect(getSocialLabel({ name: '   ', url: 'not a url' })).toBe('not a url');
  });

  it('returns the raw url when it cannot be parsed', () => {
    expect(getSocialLabel({ url: 'not a url' })).toBe('not a url');
  });
});

describe('isGitHubSocial', () => {
  it.each([
    'https://github.com/user',
    'https://www.github.com/user',
    'github.com/user',
    'HTTPS://GitHub.com/user',
  ])('accepts %s', (url) => {
    expect(isGitHubSocial({ url })).toBe(true);
  });

  it.each([
    'https://evil.com/github.com',
    'https://github.com.evil.com/x',
    'https://notgithub.com/x',
    'https://api.github.com/x',
    'https://linkedin.com/in/x?ref=github.com',
    '',
  ])('rejects %s', (url) => {
    expect(isGitHubSocial({ url })).toBe(false);
  });
});
