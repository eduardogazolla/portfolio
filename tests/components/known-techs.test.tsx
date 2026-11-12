/// <reference types="@testing-library/jest-dom" />
import { render, screen, within } from '@testing-library/react';
import { KnownTechs } from '../../app/componentes/pages/home/known-techs';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { KnownTech } from '../../app/types/projects';

const techs: KnownTech[] = [
  { name: 'React', startDate: '2024-03-01' },
  { name: 'CSS', startDate: '2022-01-15' },
  { name: 'TailwindCSS', startDate: '2023-06-01' },
  { name: 'HTML', startDate: '2021-12-31' },
];

const renderTechs = () =>
  render(
    <LanguageProvider>
      <KnownTechs techs={techs} />
    </LanguageProvider>
  );

describe('KnownTechs', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
  });

  it('renders the Stack title and subtitle', () => {
    renderTechs();
    expect(screen.getByRole('heading', { name: 'Stack' })).toBeInTheDocument();
    expect(screen.getByText('Tecnologias que uso no dia a dia.')).toBeInTheDocument();
  });

  it('shows only the name and "desde <year>" per tech', () => {
    renderTechs();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText('HTML')).toBeInTheDocument();
    expect(within(items[0]).getByText('desde 2021')).toBeInTheDocument();
    expect(items[0].textContent).toBe('HTMLdesde 2021');
  });

  it('sorts by startDate ascending without mutating the input', () => {
    renderTechs();
    const names = screen
      .getAllByRole('listitem')
      .map((item) => item.firstElementChild?.textContent);
    expect(names).toEqual(['HTML', 'CSS', 'TailwindCSS', 'React']);
    expect(techs[0].name).toBe('React');
  });

  it('has no icons', () => {
    const { container } = renderTechs();
    expect(container.querySelector('svg, img')).toBeNull();
  });

  it('uses the English label when the locale is en', () => {
    localStorage.setItem('portfolio-gazolla:locale', 'en');
    renderTechs();
    expect(screen.getAllByText(/^since 20/)).toHaveLength(4);
  });

  it('renders nothing when there are no techs', () => {
    const { container } = render(
      <LanguageProvider>
        <KnownTechs techs={[]} />
      </LanguageProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
