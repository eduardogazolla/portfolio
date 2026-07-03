import { render, screen } from '@testing-library/react';
import { Header } from '../app/componentes/header/index';
import { LanguageProvider } from '../app/componentes/context/language-context';

const renderWithLanguage = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

beforeEach(() => {
  localStorage.clear();
});

describe('Header', () => {
  it('renders header with navigation', () => {
    renderWithLanguage(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders home link', () => {
    renderWithLanguage(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders projects link', () => {
    renderWithLanguage(<Header />);
    // In test env, navigator.language may be "en", so check for either label
    const projectsLink = screen.getByRole('link', { name: /Projects|Projetos/i });
    expect(projectsLink).toBeInTheDocument();
  });

  it('renders language selector button', () => {
    renderWithLanguage(<Header />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});