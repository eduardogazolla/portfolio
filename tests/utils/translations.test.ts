import { dictionaries } from '../../app/utils/translations';

type Tree = { [key: string]: string | ((count: number) => string) | Tree };

// Flattens string leaves; functions (formatters) are tracked as "<fn>".
const flatten = (node: Tree, prefix = ''): Record<string, string> =>
  Object.entries(node).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') acc[path] = value;
    else if (typeof value === 'function') acc[path] = '<fn>';
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});

const ptDict = dictionaries['pt-BR'];
const enDict = dictionaries.en;
const pt = flatten(ptDict as unknown as Tree);
const en = flatten(enDict as unknown as Tree);

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

  it('exposes every new interface group', () => {
    const groups = [
      'a11y',
      'menu',
      'stack',
      'experience',
      'projectsSection',
      'contactVoice',
      'projectDetail',
      'notFound',
    ];
    for (const group of groups) {
      expect(Object.keys(pt).some((key) => key.startsWith(`${group}.`))).toBe(true);
    }
  });
});

describe('projectsSection.projectsCount', () => {
  it.each([
    [0, '0 projetos', '0 projects'],
    [1, '1 projeto', '1 project'],
    [4, '4 projetos', '4 projects'],
  ])('pluralizes %i', (count, expectedPt, expectedEn) => {
    expect(ptDict.projectsSection.projectsCount(count)).toBe(expectedPt);
    expect(enDict.projectsSection.projectsCount(count)).toBe(expectedEn);
  });
});
