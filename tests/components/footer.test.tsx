/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from '../../app/componentes/footer';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const socials = [{ name: 'GitHub', url: 'https://github.com/eduardogazolla' }];

const renderFooter = () =>
  render(
    <LanguageProvider>
      <Footer socials={socials} />
    </LanguageProvider>
  );

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
});

describe('Footer', () => {
  it('renders the socials and the CV download', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Baixar currículo' })).toBeInTheDocument();
  });

  it('opens the CV list upwards, since it sits at the bottom of the page', async () => {
    renderFooter();
    const trigger = screen.getByRole('button', { name: 'Baixar currículo' });
    await userEvent.setup().click(trigger);
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)!.className).toMatch(/bottom-full/);
  });
});
