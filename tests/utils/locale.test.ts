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

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [{ text }],
});

describe('pickLocale', () => {
  it('returns PT when locale is pt-BR', () => {
    const en: Content = { ...pt, title: 'Title' };
    expect(pickLocale(pt, en, 'pt-BR')).toBe(pt);
  });

  it('falls back to PT for null or undefined EN content', () => {
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
      items: [],
      nested: { label: 'label' },
    } as Content;
    expect(pickLocale(pt, en, 'en')).toEqual({
      title: 'Título',
      role: 'Papel',
      intro: { raw: { children: [{ text: 'Hello' }] } },
      items: pt.items,
      nested: { label: 'label' },
    });
  });

  it('falls back to PT when an EN object is missing', () => {
    const en = { title: 'Title', items: [], nested: null } as unknown as Content;
    const result = pickLocale(pt, en, 'en');
    expect(result.title).toBe('Title');
    expect(result.nested).toEqual(pt.nested);
    expect(result.intro).toEqual(pt.intro);
  });

  it('treats arrays as atomic: a different-length EN array is returned as is', () => {
    const items = [{ name: 'Three' }];
    const en = { ...pt, items } as Content;
    expect(pickLocale(pt, en, 'en').items).toBe(items);
  });

  it('does not copy PT fields into reordered EN array items', () => {
    const en = { ...pt, items: [{ name: 'Two' }, { name: 'One' }] } as Content;
    expect(pickLocale(pt, en, 'en').items).toEqual([
      { name: 'Two' },
      { name: 'One' },
    ]);
  });

  it('uses PT for an empty EN array', () => {
    const en = { ...pt, items: [] } as Content;
    expect(pickLocale(pt, en, 'en').items).toBe(pt.items);
  });

  it('treats rich text as atomic: EN with fewer nodes is returned exactly', () => {
    const enRich = { raw: { children: [paragraph('Only one')] } };
    const ptRich = {
      raw: { children: [paragraph('Um'), paragraph('Dois')] },
    };
    const result = pickLocale({ intro: ptRich }, { intro: enRich }, 'en');
    expect(result.intro).toBe(enRich);
  });

  it('falls back to PT rich text when EN has only empty paragraphs', () => {
    const ptRich = { raw: { children: [paragraph('Um')] } };
    const emptyRich = { raw: { children: [paragraph(''), paragraph('  ')] } };
    const result = pickLocale({ intro: ptRich }, { intro: emptyRich }, 'en');
    expect(result.intro).toBe(ptRich);
  });
});
