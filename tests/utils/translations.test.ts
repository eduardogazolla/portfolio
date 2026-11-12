import { dictionaries } from '../../app/utils/translations';

type Tree = { [key: string]: string | Tree };

const flatten = (node: Tree, prefix = ''): Record<string, string> =>
  Object.entries(node).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') acc[path] = value;
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});

const pt = flatten(dictionaries['pt-BR'] as unknown as Tree);
const en = flatten(dictionaries.en as unknown as Tree);

describe('translations', () => {
  it('has the same key structure in PT and EN', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(pt).sort());
  });

  it.each([
    ['pt-BR', pt],
    ['en', en],
  ])('has no empty strings in %s', (_locale, flat) => {
    const empty = Object.entries(flat)
      .filter(([, value]) => value.trim() === '')
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it('exposes the new interface groups', () => {
    for (const group of ['a11y', 'menu', 'contactVoice', 'experience', 'stack']) {
      expect(Object.keys(pt).some((key) => key.startsWith(`${group}.`))).toBe(true);
    }
  });
});
