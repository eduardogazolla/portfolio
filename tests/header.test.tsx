/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Header } from '../app/componentes/header/index';
import { LanguageProvider } from '../app/componentes/context/language-context';

const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

const socials = [{ name: 'GitHub', url: 'https://github.com/eduardogazolla' }];
const NAV_NAME = /Navegação principal|Main navigation/i;

const renderHeader = () =>
  render(
    <LanguageProvider>
      <Header socials={socials} />
    </LanguageProvider>
  );

beforeEach(() => {
  localStorage.clear();
  mockPathname.mockReturnValue('/');
});

describe('Header', () => {
  it('shows the name as a link to the home page', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Eduardo Gazolla' })).toHaveAttribute('href', '/');
  });

  it('renders the desktop navigation with Home, Projects and Contact', () => {
    renderHeader();
    const nav = screen.getByRole('navigation', { name: NAV_NAME });
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [a.textContent, a.getAttribute('href')]);
    expect(links).toEqual([
      ['Home', '/'],
      [expect.stringMatching(/Projetos|Projects/), '/projects'],
      [expect.stringMatching(/Contato|Contact/), '/#contact'],
    ]);
  });

  it('marks the current page with aria-current', () => {
    mockPathname.mockReturnValue('/projects');
    renderHeader();
    const nav = screen.getByRole('navigation', { name: NAV_NAME });
    expect(nav.querySelector('[aria-current="page"]')).toHaveAttribute('href', '/projects');
  });

  it('renders the language switch group', () => {
    renderHeader();
    expect(screen.getByRole('group', { name: /Idioma|Language/ })).toBeInTheDocument();
  });

  it('renders the Menu button, collapsed and linked to the menu dialog', () => {
    renderHeader();
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls');
  });
});
