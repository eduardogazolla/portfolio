/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Footer } from '../app/componentes/footer/index';
import { LanguageProvider } from '../app/componentes/context/language-context';

const renderWithLanguage = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('Footer', () => {
  it('renders footer with text', () => {
    renderWithLanguage(<Footer />);
    expect(screen.getByText('Eduardo Gazolla')).toBeInTheDocument();
  });

  it('renders Instagram link', () => {
    renderWithLanguage(<Footer />);
    const link = screen.getByRole('link', { name: /Eduardo Gazolla/i });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/eduardogazolla/');
  });
});