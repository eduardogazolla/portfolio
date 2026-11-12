/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '../../app/componentes/pages/home/hero-section';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { HomePageInfo } from '../../app/types/page-info';
import type { WorkExperience } from '../../app/types/work-experience';

const homeInfo: HomePageInfo = {
  role: 'Desenvolvedor front-end e analista de testes',
  introduction: {
    raw: {
      children: [{ type: 'paragraph', children: [{ text: 'Construo interfaces bonitas e funcionais.' }] }],
    },
  },
  profilePicture: { url: 'https://media.graphassets.com/portrait.jpg' },
  socials: [
    { name: 'GitHub', url: 'https://github.com/eduardogazolla' },
    { name: null, url: 'https://www.linkedin.com/in/eduardogazolla' },
  ],
  knownTechs: [],
  highlightProjects: [],
};

const current: WorkExperience = {
  role: 'Analista de Testes',
  companyName: 'DB1 Global Software',
  startDate: '2025-02-01',
  endDate: null,
  technologies: [],
};

const renderHero = (experience: WorkExperience | null = current) =>
  render(
    <LanguageProvider>
      <HeroSection homeInfo={homeInfo} currentExperience={experience} />
    </LanguageProvider>
  );

describe('HeroSection', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
  });

  it('renders the CMS role line', () => {
    renderHero();
    expect(screen.getByText(homeInfo.role as string)).toBeInTheDocument();
  });

  it('renders the full name as a single h1', () => {
    renderHero();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Eduardo Gazolla' })).toBeInTheDocument();
  });

  it('renders the introduction rich text', () => {
    renderHero();
    expect(screen.getByText('Construo interfaces bonitas e funcionais.')).toBeInTheDocument();
  });

  it('shows the current experience line only when there is one', () => {
    const { unmount } = renderHero();
    expect(screen.getByText('Agora: Analista de Testes na DB1 Global Software')).toBeInTheDocument();
    unmount();

    renderHero(null);
    expect(screen.queryByText(/^Agora:/)).not.toBeInTheDocument();
  });

  it('renders socials with labels, falling back to the host', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/eduardogazolla');
    expect(screen.getByRole('link', { name: /^LinkedIn/ })).toBeInTheDocument();
  });

  it('renders a descriptive photo alt', () => {
    renderHero();
    expect(screen.getByRole('img', { name: /Eduardo Gazolla/ })).toBeInTheDocument();
  });

  it('links "Ver projetos" to /projects', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '/projects');
  });

  it('scrolls to #contact and focuses its first field', async () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    document.body.insertAdjacentHTML(
      'beforeend',
      '<section id="contact"><input aria-label="nome" /></section>'
    );
    renderHero();
    await userEvent.click(screen.getByRole('button', { name: 'Vamos conversar' }));
    expect(scrollIntoView).toHaveBeenCalled();
    expect(screen.getByLabelText('nome')).toHaveFocus();
    document.getElementById('contact')?.remove();
  });

  it('renders final content without any intro attribute or hidden state', () => {
    renderHero();
    expect(document.documentElement).not.toHaveAttribute('data-intro');
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
