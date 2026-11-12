import { pickLocale } from '@/app/utils/locale';

type Item = { name: string; note?: string | null };
type Content = {
  title: string;
  role?: string | null;
  intro: { raw: { children: { text: string }[] } };
  items: Item[];
  nested: { label: string };
};

const pt: Content = {
  title: 'Título',
  role: 'Papel',
  intro: { raw: { children: [{ text: 'Olá' }] } },
  items: [{ name: 'Um', note: 'nota' }, { name: 'Dois' }],
  nested: { label: 'rótulo' },
};

describe('pickLocale', () => {
  it('returns PT when locale is pt-BR', () => {
    const en: Content = { ...pt, title: 'Title' };
    expect(pickLocale(pt, en, 'pt-BR')).toBe(pt);
  });

  it('returns PT when EN is missing', () => {
    expect(pickLocale(pt, null, 'en')).toBe(pt);
    expect(pickLocale(pt, undefined, 'en')).toBe(pt);
  });

  it('uses EN values when present', () => {
    const en: Content = {
      title: 'Title',
      role: 'Role',
      intro: { raw: { children: [{ text: 'Hello' }] } },
      items: [{ name: 'One', note: 'note' }, { name: 'Two' }],
      nested: { label: 'label' },
    };
    expect(pickLocale(pt, en, 'en')).toEqual(en);
  });

  it('falls back to PT field by field for empty or null EN values', () => {
    const en = {
      title: '',
      role: null,
      intro: { raw: { children: [{ text: 'Hello' }] } },
      items: [{ name: 'One', note: null }, { name: '   ' }],
      nested: { label: 'label' },
    } as Content;
    expect(pickLocale(pt, en, 'en')).toEqual({
      title: 'Título',
      role: 'Papel',
      intro: { raw: { children: [{ text: 'Hello' }] } },
      items: [{ name: 'One', note: 'nota' }, { name: 'Dois' }],
      nested: { label: 'label' },
    });
  });

  it('falls back to PT when an EN object or array is missing or empty', () => {
    const en = { title: 'Title', items: [], nested: null } as unknown as Content;
    const result = pickLocale(pt, en, 'en');
    expect(result.title).toBe('Title');
    expect(result.items).toEqual(pt.items);
    expect(result.nested).toEqual(pt.nested);
    expect(result.intro).toEqual(pt.intro);
  });

  it('keeps PT-only items beyond the EN array length', () => {
    const en = { ...pt, items: [{ name: 'One' }] } as Content;
    expect(pickLocale(pt, en, 'en').items).toEqual([
      { name: 'One', note: 'nota' },
      { name: 'Dois' },
    ]);
  });
});
