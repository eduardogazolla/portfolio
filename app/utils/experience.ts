import { differenceInMonths, format, parseISO } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import type { Locale } from './translations';

type ExperiencePeriod = {
  startDate: string;
  endDate?: string | null;
};

export type DurationLabels = {
  and: string;
  year: string;
  years: string;
  month: string;
  months: string;
};

const dateLocales = { 'pt-BR': ptBR, en: enUS } as const;

/** The open experience (no endDate) with the most recent startDate, or null. */
export const getCurrentExperience = <T extends ExperiencePeriod>(
  experiences: T[],
): T | null =>
  experiences
    .filter((experience) => !experience.endDate)
    .reduce<T | null>(
      (latest, experience) =>
        !latest || experience.startDate > latest.startDate
          ? experience
          : latest,
      null,
    );

const unit = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

/**
 * "1 year and 9 months". Months are rounded down, minimum "1 month".
 * A missing end means today. Labels come from the translations dictionary.
 */
export const formatDuration = (
  start: string,
  end: string | null | undefined,
  labels: DurationLabels,
): string => {
  const endDate = end ? parseISO(end) : new Date();
  const totalMonths = Math.max(1, differenceInMonths(endDate, parseISO(start)));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [
    years > 0 ? unit(years, labels.year, labels.years) : null,
    months > 0 ? unit(months, labels.month, labels.months) : null,
  ].filter((part): part is string => part !== null);

  return parts.join(` ${labels.and} `);
};

/** "Feb 2025 – present" / "fev 2025 – atual". `currentLabel` is the open-period word. */
export const formatPeriod = (
  start: string,
  end: string | null | undefined,
  locale: Locale,
  currentLabel: string,
): string => {
  const pattern = 'MMM yyyy';
  const options = { locale: dateLocales[locale] };
  const from = format(parseISO(start), pattern, options);
  const to = end ? format(parseISO(end), pattern, options) : currentLabel;
  return `${from} – ${to}`;
};
