/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import NotFound from '../../app/not-found';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const renderPage = (locale: string) => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  return render(
    <LanguageProvider>
      <NotFound />
    </LanguageProvider>
  );
};

describe('NotFound', () => {
  it('shows the decorative 404 inside a dashed outline, hidden from assistive tech', () => {
    const { container } = renderPage('pt-BR');
    const code = screen.getByText('404', { selector: 'span' });
    const wrapper = code.parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.querySelector('[data-part="box"]')).toHaveClass('border-dashed');
    expect(screen.getByText('elemento não encontrado')).toBeInTheDocument();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  it('shows heading, text and the two actions (pt-BR)', () => {
    renderPage('pt-BR');
    expect(screen.getByRole('heading', { level: 1, name: 'Essa página não existe.' })).toBeInTheDocument();
    expect(screen.getByText(/O link pode estar quebrado/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar para a Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '/projects');
  });

  it('is translated to English', () => {
    renderPage('en');
    expect(screen.getByRole('heading', { level: 1, name: 'This page does not exist.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'View projects' })).toHaveAttribute('href', '/projects');
  });
});
