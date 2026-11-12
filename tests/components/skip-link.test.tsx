import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { SkipLink } from '../../app/componentes/skip-link';

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window.navigator, 'language', { value: 'pt-BR', configurable: true });
});

const setup = () =>
  render(
    <LanguageProvider>
      <SkipLink />
      <button>other</button>
    </LanguageProvider>
  );

describe('SkipLink', () => {
  it('is a link to #main with a localized name', () => {
    setup();
    const link = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(link).toHaveAttribute('href', '#main');
  });

  it('is the first focusable element', () => {
    const { container } = setup();
    const first = container.querySelector('a, button');
    expect(first).toBe(screen.getByRole('link', { name: 'Pular para o conteúdo' }));
  });

  it('is hidden until focused', () => {
    setup();
    const cls = screen.getByRole('link').className;
    expect(cls).toMatch(/sr-only/);
    expect(cls).toMatch(/focus:not-sr-only/);
    expect(cls).toMatch(/focus:bg-accent/);
    expect(cls).toMatch(/focus:text-on-accent/);
  });

  it('uses English copy when the locale is en', () => {
    localStorage.setItem('portfolio-gazolla:locale', 'en');
    setup();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  });
});
