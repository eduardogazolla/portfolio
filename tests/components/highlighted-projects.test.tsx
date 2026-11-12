/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { HighlightedProjects } from '../../app/componentes/pages/home/highlighted-projects';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { Project } from '../../app/types/projects';
import type { Social } from '../../app/types/page-info';

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  slug: 'hour-sync',
  title: 'Hour Sync',
  context: 'TCC',
  shortDescription: 'Controle de ponto feito como TCC.',
  description: { raw: { children: [] }, text: '' },
  technologies: [{ name: 'React' }, { name: 'TypeScript' }],
  thumbnail: { url: 'https://media.example.com/hour-sync.png' },
  pageThumbnail: { url: 'https://media.example.com/page.png' },
  sections: [],
  ...overrides,
});

const socials: Social[] = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/x' },
  { name: 'GitHub', url: 'https://github.com/x' },
];

const renderSection = (projects: Project[], s: Social[] = socials, locale = 'pt-BR') => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  return render(
    <LanguageProvider>
      <HighlightedProjects projects={projects} socials={s} />
    </LanguageProvider>
  );
};

describe('HighlightedProjects', () => {
  it('renders nothing without highlighted projects', () => {
    const { container } = renderSection([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the section title as h2 and project titles as h3', () => {
    renderSection([makeProject()]);
    expect(screen.getByRole('heading', { level: 2, name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Hour Sync' })).toBeInTheDocument();
  });

  it('uses the project title as the image alt', () => {
    renderSection([makeProject()]);
    expect(screen.getByRole('img', { name: 'Hour Sync' })).toBeInTheDocument();
  });

  it('shows the context label only when filled', () => {
    const { unmount } = renderSection([makeProject()]);
    expect(screen.getByText('TCC')).toBeInTheDocument();
    unmount();
    renderSection([makeProject({ context: null })]);
    expect(screen.queryByText('TCC')).not.toBeInTheDocument();
  });

  it('renders description, tech badges and a link to the project', () => {
    renderSection([makeProject()]);
    expect(screen.getByText('Controle de ponto feito como TCC.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver projeto/ })).toHaveAttribute('href', '/projects/hour-sync');
  });

  it('links to all projects', () => {
    renderSection([makeProject()]);
    const links = screen.getAllByRole('link', { name: /Ver todos os projetos/ });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) => expect(l).toHaveAttribute('href', '/projects'));
  });

  it('shows the "more coming" line with the CMS GitHub link', () => {
    renderSection([makeProject()]);
    expect(screen.getByText(/Mais projetos chegando/)).toBeInTheDocument();
    const gh = screen.getByRole('link', { name: /GitHub/ });
    expect(gh).toHaveAttribute('href', 'https://github.com/x');
  });

  it('hides the GitHub link when the CMS has no GitHub social', () => {
    renderSection([makeProject()], [{ name: 'LinkedIn', url: 'https://linkedin.com/in/x' }]);
    expect(screen.getByText(/Mais projetos chegando/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
  });

  it('uses English strings in EN', () => {
    renderSection([makeProject()], socials, 'en');
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View project/i })).toBeInTheDocument();
    expect(screen.getByText(/More projects coming/i)).toBeInTheDocument();
  });

  it('ignores a social that only mentions github.com in its path', () => {
    renderSection([makeProject()], [{ name: 'Fake', url: 'https://evil.com/github.com' }]);
    expect(screen.queryByRole('link', { name: /Fake/ })).not.toBeInTheDocument();
  });

  it('hides the empty thumbnail placeholder from assistive tech', () => {
    const { container } = renderSection([makeProject({ thumbnail: null })]);
    expect(container.querySelector('article > div')).toHaveAttribute('aria-hidden', 'true');
  });
});
