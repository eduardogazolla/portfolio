import type { Locale } from './translations';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isRichText = (value: unknown): boolean =>
  isPlainObject(value) && 'raw' in value;

const hasText = (node: unknown): boolean => {
  if (!isPlainObject(node)) return false;
  if (typeof node.text === 'string' && node.text.trim() !== '') return true;
  return Array.isArray(node.children) && node.children.some(hasText);
};

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value) && 'raw' in value) return !hasText(value.raw);
  return false;
};

const merge = (pt: unknown, en: unknown): unknown => {
  if (isEmpty(en)) return pt;
  // Arrays and rich text are atomic: a partial EN list or document is never
  // mixed with PT content.
  if (isRichText(en) || !isPlainObject(pt) || !isPlainObject(en)) return en;
  const keys = new Set([...Object.keys(pt), ...Object.keys(en)]);
  return Object.fromEntries(
    Array.from(keys).map((key) => [key, merge(pt[key], en[key])]),
  );
};

/**
 * Content for the active locale. For "en", plain objects merge field by field:
 * an empty EN value (null, undefined, blank string, empty array, rich text
 * without any text) falls back to PT. Arrays and rich-text objects (with a
 * `raw` key) are atomic: a non-empty EN value is used whole, never mixed with PT.
 */
export const pickLocale = <T>(
  pt: T,
  en: T | null | undefined,
  locale: Locale,
): T => {
  if (locale !== 'en' || en === null || en === undefined) return pt;
  return merge(pt, en) as T;
};
