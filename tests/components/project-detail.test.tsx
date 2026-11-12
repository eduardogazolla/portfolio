/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { ProjectDetailClient } from '../../app/componentes/pages/project/project-detail-client';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { Project } from '../../app/types/projects';
import type { LocalizedProjectPageData } from '../../app/types/page-info';

beforeAll(() => {
  // jsdom has no IntersectionObserver; the section images use whileInView.
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  slug: 'hour-sync',
  title: 'Hour Sync',
  context: 'TCC de Análise e Desenvolvimento de Sistemas',
  shortDescription: 'Controle de ponto corporativo',
  description: {
    raw: { children: [{ type: 'paragraph', children: [{ text: 'Sistema de ponto com restrição por IP.' }] }] },
    text: 'Sistema de ponto com restrição por IP.',
  },
  gitHubUrl: 'https://github.com/x/hour-sync',
  liveProjectUrl: 'https://hoursync.example.com',
  technologies: [{ name: 'React' }, { name: 'NodeJS' }],
  thumbnail: { url: 'https://sa-east-1.graphassets.com/thumb.png' },
  pageThumbnail: { url: 'https://sa-east-1.graphassets.com/page.png' },
  sections: [
    { title: 'Relatório do colaborador', image: { url: 'https://sa-east-1.graphassets.com/s1.png' } },
    { title: 'Login', image: { url: 'https://sa-east-1.graphassets.com/s2.png' } },
  ],
  ...overrides,
});

const renderDetail = (
  pt: Project,
  { en = null, total = 4, locale = 'pt-BR' }: { en?: Project | null; total?: number; locale?: string } = {}
) => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  const data: LocalizedProjectPageData = { ptProject: pt, enProject: en, totalProjects: total };
  return render(
    <LanguageProvider>
      <ProjectDetailClient data={data} />
    </LanguageProvider>
  );
};

describe('ProjectDetailClient (pt-BR)', () => {
  it('shows the back link, h1 and the meta columns', () => {
    renderDetail(makeProject());
    expect(screen.getByRole('link', { name: 'Todos os projetos' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('heading', { level: 1, name: 'Hour Sync' })).toBeInTheDocument();
    expect(screen.getByText('O que é')).toBeInTheDocument();
    expect(screen.getByText('Controle de ponto corporativo')).toBeInTheDocument();
    expect(screen.getByText('Contexto')).toBeInTheDocument();
    expect(screen.getByText('TCC de Análise e Desenvolvimento de Sistemas')).toBeInTheDocument();
  });

  it('shows Repositório and Ver online only when the URLs exist', () => {
    const { unmount } = renderDetail(makeProject());
    expect(screen.getByRole('link', { name: /Repositório/ })).toHaveAttribute('href', 'https://github.com/x/hour-sync');
    expect(screen.getByRole('link', { name: /Ver online/ })).toHaveAttribute('href', 'https://hoursync.example.com');
    unmount();

    renderDetail(makeProject({ gitHubUrl: undefined, liveProjectUrl: undefined }));
    expect(screen.queryByRole('link', { name: /Repositório/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Ver online/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Links')).not.toBeInTheDocument();
  });

  it('omits Contexto without context', () => {
    renderDetail(makeProject({ context: null }));
    expect(screen.queryByText('Contexto')).not.toBeInTheDocument();
  });

  it('shows the main image, the about block and one block per section', () => {
    renderDetail(makeProject());
    expect(screen.getByRole('img', { name: 'Hour Sync' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Sobre o projeto' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('NodeJS')).toBeInTheDocument();
    expect(screen.getByText('Sistema de ponto com restrição por IP.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Relatório do colaborador' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Relatório do colaborador' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows the only-project notice when the total is 1', () => {
    renderDetail(makeProject(), { total: 1 });
    expect(screen.getByText('Por enquanto, este é o único projeto publicado.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar para todos os projetos' })).toHaveAttribute('href', '/projects');
  });

  it('hides the notice when there are more projects', () => {
    renderDetail(makeProject(), { total: 3 });
    expect(screen.queryByText(/único projeto publicado/)).not.toBeInTheDocument();
  });

  it('renders the contact band', () => {
    renderDetail(makeProject());
    expect(screen.getByText('Vamos conversar?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Escrever mensagem' })).toHaveAttribute('href', '/#contact');
  });
});

describe('ProjectDetailClient (en)', () => {
  it('uses the EN project and labels', () => {
    renderDetail(makeProject(), {
      locale: 'en',
      total: 1,
      en: makeProject({ title: 'Hour Sync EN', shortDescription: 'Corporate time clock', context: 'Capstone' }),
    });
    expect(screen.getByRole('link', { name: 'All projects' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Hour Sync EN' })).toBeInTheDocument();
    expect(screen.getByText('What it is')).toBeInTheDocument();
    expect(screen.getByText('Corporate time clock')).toBeInTheDocument();
    expect(screen.getByText('Context')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Repository/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View live/ })).toBeInTheDocument();
    expect(screen.getByText('For now, this is the only published project.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Write a message' })).toHaveAttribute('href', '/#contact');
  });
});
