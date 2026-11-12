import { getSocialLabel } from '@/app/utils/socials';

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

  it('returns the raw url when it cannot be parsed', () => {
    expect(getSocialLabel({ url: 'not a url' })).toBe('not a url');
  });
});
