import {
  formatDuration,
  formatPeriod,
  getCurrentExperience,
} from '@/app/utils/experience';
import { dictionaries } from '@/app/utils/translations';

const exp = (startDate: string, endDate: string | null = null) => ({
  startDate,
  endDate,
});

describe('getCurrentExperience', () => {
  it('returns the experience without endDate', () => {
    const current = exp('2024-01-01');
    const list = [exp('2020-01-01', '2023-01-01'), current];
    expect(getCurrentExperience(list)).toBe(current);
  });

  it('returns the most recent startDate when there are two current ones', () => {
    const older = exp('2022-01-01');
    const newer = exp('2025-02-01');
    expect(getCurrentExperience([older, newer])).toBe(newer);
    expect(getCurrentExperience([newer, older])).toBe(newer);
  });

  it('returns null when none is current', () => {
    expect(getCurrentExperience([exp('2020-01-01', '2021-01-01')])).toBeNull();
    expect(getCurrentExperience([])).toBeNull();
  });
});

describe('formatDuration', () => {
  const pt = dictionaries['pt-BR'].experience.duration;
  const en = dictionaries.en.experience.duration;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-15T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  it('formats years and months in PT', () => {
    expect(formatDuration('2025-02-01', '2026-11-15', 'pt-BR', pt)).toBe(
      '1 ano e 9 meses',
    );
  });

  it('formats years and months in EN', () => {
    expect(formatDuration('2025-02-01', '2026-11-15', 'en', en)).toBe(
      '1 year and 9 months',
    );
  });

  it('pluralizes years and singularizes month in PT', () => {
    expect(formatDuration('2024-10-01', '2026-11-15', 'pt-BR', pt)).toBe(
      '2 anos e 1 mês',
    );
  });

  it('omits months when the remainder is zero', () => {
    expect(formatDuration('2025-11-01', '2026-11-15', 'pt-BR', pt)).toBe(
      '1 ano',
    );
  });

  it('shows only months under a year', () => {
    expect(formatDuration('2026-05-01', '2026-11-15', 'pt-BR', pt)).toBe(
      '6 meses',
    );
  });

  it('rounds months down', () => {
    expect(formatDuration('2026-09-16', '2026-11-14', 'pt-BR', pt)).toBe(
      '1 mês',
    );
  });

  it('has a minimum of 1 month', () => {
    expect(formatDuration('2026-11-10', '2026-11-15', 'pt-BR', pt)).toBe(
      '1 mês',
    );
    expect(formatDuration('2026-11-10', '2026-11-15', 'en', en)).toBe(
      '1 month',
    );
  });

  it('uses today when end is missing', () => {
    expect(formatDuration('2025-02-01', null, 'pt-BR', pt)).toBe(
      '1 ano e 9 meses',
    );
    expect(formatDuration('2025-02-01', undefined, 'en', en)).toBe(
      '1 year and 9 months',
    );
  });
});

describe('formatPeriod', () => {
  const pt = dictionaries['pt-BR'].experience.current;
  const en = dictionaries.en.experience.current;

  it('formats an open period in PT', () => {
    expect(formatPeriod('2025-02-01', null, 'pt-BR', pt)).toBe(
      'fev 2025 – atual',
    );
  });

  it('formats an open period in EN', () => {
    expect(formatPeriod('2025-02-01', null, 'en', en)).toBe(
      'Feb 2025 – present',
    );
  });

  it('formats a closed period', () => {
    expect(formatPeriod('2022-03-01', '2024-12-01', 'pt-BR', pt)).toBe(
      'mar 2022 – dez 2024',
    );
    expect(formatPeriod('2022-03-01', '2024-12-01', 'en', en)).toBe(
      'Mar 2022 – Dec 2024',
    );
  });
});
