/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { ContactBand } from '../../app/componentes/contact-band';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const renderBand = (locale: string) => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  return render(
    <LanguageProvider>
      <ContactBand />
    </LanguageProvider>
  );
};

describe('ContactBand', () => {
  it('shows title, description and a button to the home contact form (pt-BR)', () => {
    renderBand('pt-BR');
    expect(screen.getByRole('heading', { level: 2, name: 'Vamos conversar?' })).toBeInTheDocument();
    expect(screen.getByText('Vaga ou projeto, a mensagem chega direto para mim.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Escrever mensagem' })).toHaveAttribute('href', '/#contact');
  });

  it('is translated to English', () => {
    renderBand('en');
    expect(screen.getByRole('link', { name: 'Write a message' })).toHaveAttribute('href', '/#contact');
  });
});
