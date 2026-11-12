/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProjectsList } from '../../app/componentes/pages/projects/projects-list';
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

describe('ProjectsListClient a11y and layout fixes', () => {
  it('gives each featured link a unique accessible name and loads the first image eagerly', () => {
    renderPage([makeProject()]);
    const link = screen.getByRole('link', { name: 'Ver projeto: Hour Sync' });
    expect(link).toHaveAttribute('href', '/projects/hour-sync');
    const image = screen.getByTestId('project-thumbnail').querySelector('img') as HTMLImageElement;
    expect(image).toHaveAttribute('fetchpriority', 'high');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('marks thumbnails next to the linked title as decorative (no repeated title for screen readers)', () => {
    renderPage([makeProject()]);
    expect(screen.queryByAltText('Hour Sync')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-thumbnail').querySelector('img')).toHaveAttribute('alt', '');
  });

  it('marks row thumbnails as decorative', () => {
    const { container } = renderPage(four);
    expect(container.querySelectorAll('img[alt=""]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('img:not([alt=""])')).toHaveLength(0);
  });

  it('reserves the context column on rows without context when another row has one', () => {
    renderPage(four);
    expect(screen.getAllByTestId('context-spacer')).toHaveLength(3);
  });

  it('does not reserve the column when no row has context', () => {
    const noCtx = four.map((p) => ({ ...p, context: null }));
    renderPage(noCtx);
    expect(screen.queryByTestId('context-spacer')).not.toBeInTheDocument();
  });

  it('resets the filter silently when the locale removes the active tech', () => {
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('4 projects')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('ProjectsList empty state and hover', () => {
  const clear = jest.fn();
  const renderList = (projects: Project[], filter = 'Rust') =>
    render(
      <LanguageProvider>
        <ProjectsList projects={projects} filter={filter} onClearFilter={clear} />
      </LanguageProvider>
    );

  it('announces the empty state with role=status', () => {
    renderList([]);
    expect(screen.getByRole('status')).toHaveTextContent(/Rust/);
  });

  it('calls onClearFilter from the empty state', () => {
    renderList([]);
    fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(clear).toHaveBeenCalled();
  });

  it('does not keep a cursor preview for a row that left the list', () => {
    const { rerender } = renderList(four, 'all');
    fireEvent.pointerEnter(screen.getAllByRole('listitem')[0], { pointerType: 'mouse' });
    rerender(
      <LanguageProvider>
        <ProjectsList projects={four.slice(1)} filter="React" onClearFilter={clear} />
      </LanguageProvider>
    );
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
  });
});
