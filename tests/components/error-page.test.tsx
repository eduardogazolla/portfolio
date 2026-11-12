/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from '../../app/error';
import { LanguageProvider } from '../../app/componentes/context/language-context';

type RouteError = Error & { digest?: string };

const renderPage = (locale: string, error: RouteError = new Error('secret db password')) => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  const reset = jest.fn();
  render(
    <LanguageProvider>
      <ErrorPage error={error} reset={reset} />
    </LanguageProvider>
  );
  return reset;
};

describe('ErrorPage', () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => spy.mockRestore());

  it('shows the message and actions (pt-BR) and calls reset on retry', async () => {
    const reset = renderPage('pt-BR');
    expect(screen.getByRole('heading', { level: 1, name: 'Algo deu errado.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar para a Home' })).toHaveAttribute('href', '/');
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('is translated to English', () => {
    renderPage('en');
    expect(screen.getByRole('heading', { level: 1, name: 'Something went wrong.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Home' })).toBeInTheDocument();
  });

  it('never shows error.message and logs only the digest', () => {
    const error = Object.assign(new Error('secret db password'), { digest: 'abc123' });
    renderPage('pt-BR', error);
    expect(screen.queryByText(/secret db password/)).not.toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith('Route error', 'abc123');
  });
});
