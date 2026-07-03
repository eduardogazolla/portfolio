import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../app/componentes/context/language-context';
import { LanguageSelector } from '../../app/componentes/header/language-selector';

// Helper component to display the current locale for testing
const LocaleDisplay = () => {
  const { locale, translations } = useLanguage();
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="projects-label">{translations.header.projects}</span>
    </div>
  );
};

const renderWithLanguage = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

beforeEach(() => {
  localStorage.clear();
});

describe('LanguageSelector', () => {
  it('renders the language toggle button', () => {
    renderWithLanguage(<LanguageSelector />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles locale when clicked', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );

    const initialLocale = screen.getByTestId('current-locale').textContent;
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    const newLocale = screen.getByTestId('current-locale').textContent;
    expect(newLocale).not.toBe(initialLocale);
  });

  it('toggles back when clicked twice', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );

    const initialLocale = screen.getByTestId('current-locale').textContent;
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button); // toggle away
    });
    act(() => {
      fireEvent.click(button); // toggle back
    });

    expect(screen.getByTestId('current-locale')).toHaveTextContent(initialLocale!);
  });

  it('updates translations when language changes', () => {
    renderWithLanguage(
      <>
        <LanguageSelector />
        <LocaleDisplay />
      </>
    );

    const initialProjects = screen.getByTestId('projects-label').textContent;
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    const newProjects = screen.getByTestId('projects-label').textContent;
    expect(newProjects).not.toBe(initialProjects);
  });
});
