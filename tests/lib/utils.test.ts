import { cn } from '../../app/lib/utils';

describe('cn', () => {
  it('keeps custom font-size tokens next to colour utilities', () => {
    expect(cn('text-label-m', 'text-text-muted')).toBe('text-label-m text-text-muted');
    expect(cn('text-mono-s', 'text-on-accent')).toBe('text-mono-s text-on-accent');
  });

  it('still lets a later font-size token override an earlier one', () => {
    expect(cn('text-body-m', 'text-h2')).toBe('text-h2');
  });
});
