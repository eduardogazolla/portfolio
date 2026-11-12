/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProjectsListClient } from '../../app/componentes/pages/projects/projects-list-client';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { Project } from '../../app/types/projects';
import { useLanguage } from '../../app/componentes/context/language-context';
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

const four: Project[] = [
  makeProject(),
  makeProject({ slug: 'two', title: 'Projeto Dois', context: null, technologies: [{ name: 'React' }, { name: 'NodeJS' }] }),
  makeProject({ slug: 'three', title: 'Projeto Três', context: null, technologies: [{ name: 'Java' }] }),
  makeProject({ slug: 'four', title: 'Projeto Quatro', context: null, technologies: [{ name: 'React' }] }),
];

const LocaleSwitch = () => {
  const { setLocale } = useLanguage();
  return <button onClick={() => setLocale('en')}>to-en</button>;
};

const socials: Social[] = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/x' },
  { name: 'GitHub', url: 'https://github.com/x' },
];

const renderPage = (pt: Project[], en: Project[] = pt, locale = 'pt-BR') => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  return render(
    <LanguageProvider>
      <ProjectsListClient data={{ ptProjects: pt, enProjects: en, socials }} />
    </LanguageProvider>
  );
};

describe('ProjectsListClient with one project', () => {
  it('shows the featured block without filters or counter', () => {
    renderPage([makeProject()]);
    expect(screen.getByRole('heading', { level: 1, name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Hour Sync' })).toBeInTheDocument();
    expect(screen.queryByText(/^\d+ projetos?$/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Todos' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver projeto/ })).toHaveAttribute('href', '/projects/hour-sync');
  });

  it('shows "Mais projetos chegando" with the GitHub link', () => {
    renderPage([makeProject()]);
    expect(screen.getByText(/Mais projetos chegando/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/x');
  });

  it('uses the English copy', () => {
    renderPage([makeProject()], [makeProject()], 'en');
    expect(screen.getByText(/More projects coming/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View project/ })).toBeInTheDocument();
  });
});

describe('ProjectsListClient with four projects', () => {
  it('shows the counter and filters starting at "Todos"', () => {
    renderPage(four);
    expect(screen.getByText('4 projetos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Java' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  });

  it('filters the list and updates the counter', () => {
    renderPage(four);
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('3 projetos')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Projeto Três' })).not.toBeInTheDocument();
  });

  it('links each row to its project', () => {
    renderPage(four);
    expect(screen.getByRole('link', { name: /Projeto Dois/ })).toHaveAttribute('href', '/projects/two');
  });

  it('shows "Nenhum projeto com <tech>" when the active filter no longer matches, and clears it', () => {
    // Java exists in PT only (EN calls it Go); switching to EN leaves the active filter empty.
    const en = four.map((p) => ({ ...p, technologies: p.technologies.map((t) => (t.name === 'Java' ? { name: 'Go' } : t)) }));
    localStorage.clear();
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
    render(
      <LanguageProvider>
        <LocaleSwitch />
        <ProjectsListClient data={{ ptProjects: four, enProjects: en, socials }} />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Java' }));
    fireEvent.click(screen.getByRole('button', { name: 'to-en' }));
    expect(screen.getByText('No project with Java')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(screen.getByText('4 projects')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the English copy', () => {
    renderPage(four, four, 'en');
    expect(screen.getByText('4 projects')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('pairs EN projects by slug, not by position', () => {
    const en = [
      { ...four[3], title: 'Fourth EN' },
      { ...four[0], title: 'Hour Sync EN' },
    ];
    renderPage(four, en, 'en');
    expect(screen.getByRole('heading', { name: 'Hour Sync EN' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fourth EN' })).toBeInTheDocument();
    // missing EN falls back to PT
    expect(screen.getByRole('heading', { name: 'Projeto Dois' })).toBeInTheDocument();
    expect(within(screen.getAllByRole('heading', { level: 2 })[0].closest('li') as HTMLElement).getByRole('link')).toHaveAttribute('href', '/projects/hour-sync');
  });
});
