import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../app/componentes/context/language-context';
import { LanguageSelector } from '../../app/componentes/header/language-selector';

const mockReducedMotion = jest.fn(() => false);
jest.mock('@/app/lib/use-prefers-reduced-motion', () => ({ usePrefersReducedMotion: () => mockReducedMotion() }));
let lastPillProps: { transition?: { duration?: number } } | undefined;
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react');
  const React = jest.requireActual('react');
  return {
    ...actual,
    motion: {
      ...actual.motion,
      span: (props: { transition?: { duration?: number }; layoutId?: string; className?: string }) => {
        lastPillProps = props;
        return React.createElement('span', { 'aria-hidden': 'true', className: props.className });
      },
    },
  };
});

const LocaleDisplay = () => {
  const { locale, translations } = useLanguage();
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="projects-label">{translations.header.projects}</span>
    </div>
  );
};

const renderWithLanguage = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

beforeEach(() => {
  localStorage.clear();
  lastPillProps = undefined;
  mockReducedMotion.mockReturnValue(false);
  Object.defineProperty(window.navigator, 'language', { value: 'pt-BR', configurable: true });
});

describe('LanguageSelector', () => {
  it('renders a labelled group with PT and EN buttons', () => {
    renderWithLanguage(<LanguageSelector />);
    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
  });

  it('reflects the active locale with aria-pressed', () => {
    renderWithLanguage(<LanguageSelector />);
    expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setLocale when clicking the inactive language', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    });
    expect(screen.getByTestId('current-locale')).toHaveTextContent('en');
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
  });

  it('does nothing when clicking the already active language', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );
    const before = screen.getByTestId('current-locale').textContent;
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'PT' }));
    });
    expect(screen.getByTestId('current-locale').textContent).toBe(before);
  });

  it('updates translations when language changes', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );
    const initial = screen.getByTestId('projects-label').textContent;
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    });
    expect(screen.getByTestId('projects-label').textContent).not.toBe(initial);
  });

  it('renders the sliding pill only behind the active button', () => {
    renderWithLanguage(<LanguageSelector />);
    const pt = screen.getByRole('button', { name: 'PT' });
    const en = screen.getByRole('button', { name: 'EN' });
    expect(pt.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(en.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('uses a spring transition normally and an instant one with reduced motion', () => {
    const { unmount } = renderWithLanguage(<LanguageSelector />);
    expect(lastPillProps?.transition).toMatchObject({ type: 'spring' });
    unmount();
    mockReducedMotion.mockReturnValue(true);
    renderWithLanguage(<LanguageSelector />);
    expect(lastPillProps?.transition).toEqual({ duration: 0 });
  });

  it('styles the pill and container fully rounded with the Figma colors', () => {
    renderWithLanguage(<LanguageSelector />);
    expect(screen.getByRole('group').className).toMatch(/rounded-full/);
    const pt = screen.getByRole('button', { name: 'PT' });
    expect(pt.className).toMatch(/text-on-accent/);
    expect(pt.querySelector('span')?.className).toMatch(/bg-text/);
  });
});
