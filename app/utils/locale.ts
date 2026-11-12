import type { Locale } from './translations';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const merge = (pt: unknown, en: unknown): unknown => {
  if (isEmpty(en)) return pt;
  if (Array.isArray(pt) && Array.isArray(en)) {
    const length = Math.max(pt.length, en.length);
    return Array.from({ length }, (_, index) => merge(pt[index], en[index]));
  }
  if (isPlainObject(pt) && isPlainObject(en)) {
    const keys = new Set([...Object.keys(pt), ...Object.keys(en)]);
    return Object.fromEntries(
      Array.from(keys).map((key) => [key, merge(pt[key], en[key])]),
    );
  }
  return en;
};

/**
 * Content for the active locale. EN values replace PT field by field;
 * empty (null, undefined, blank string, empty array) EN values fall back to PT.
 * Arrays are merged by index.
 */
export const pickLocale = <T>(
  pt: T,
  en: T | null | undefined,
  locale: Locale,
): T => {
  if (locale !== 'en' || en === null || en === undefined) return pt;
  return merge(pt, en) as T;
};
