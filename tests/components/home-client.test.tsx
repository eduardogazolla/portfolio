/// <reference types="@testing-library/jest-dom" />
import { render } from '@testing-library/react';
import { HomeClient } from '../../app/componentes/pages/home/home-client';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { HomePageInfo, LocalizedHomePageData } from '../../app/types/page-info';

jest.mock('../../app/componentes/pages/home/hero-section', () => ({
  HeroSection: () => <section data-testid="hero" />,
}));

const page: HomePageInfo = {
  role: 'Dev',
  introduction: { raw: { children: [] } },
  profilePicture: { url: 'https://media.example.com/p.jpg' },
  socials: [{ name: 'GitHub', url: 'https://github.com/x' }],
  knownTechs: [{ name: 'React', startDate: '2024-01-01' }],
  highlightProjects: [
    {
      slug: 'hour-sync',
      title: 'Hour Sync',
      shortDescription: 'desc',
      description: { raw: { children: [] }, text: '' },
      technologies: [{ name: 'React' }],
      thumbnail: { url: 'https://media.example.com/t.png' },
      pageThumbnail: { url: 'https://media.example.com/t.png' },
      sections: [],
    },
  ],
};

const data: LocalizedHomePageData = {
  ptPage: page,
  enPage: page,
  ptWorkExperiences: [
    { role: 'Analista', companyName: 'DB1', startDate: '2025-02-01', endDate: null, technologies: [] },
  ],
  enWorkExperiences: [],
};

describe('HomeClient', () => {
  beforeEach(() => {
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
    // jsdom has no IntersectionObserver; the contact form's motion.form needs one.
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders the sections in Figma order with exactly one #contact at the end', () => {
    const { container } = render(
      <LanguageProvider>
        <HomeClient data={data} />
      </LanguageProvider>
    );
    expect(container.querySelectorAll('#contact')).toHaveLength(1);
    const ids = Array.from(container.querySelectorAll('section')).map(
      (s) => s.id || s.getAttribute('data-testid')
    );
    const order = ['hero', 'stack', 'projects', 'experience', 'contact'];
    const positions = order.map((id) => ids.indexOf(id));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('renders the contact title from the contact voice', () => {
    const { getByRole } = render(
      <LanguageProvider>
        <HomeClient data={data} />
      </LanguageProvider>
    );
    expect(getByRole('heading', { name: 'Vamos conversar?' })).toBeInTheDocument();
  });
});
