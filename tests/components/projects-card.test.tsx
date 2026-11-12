import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../../app/componentes/pages/projects/projects-card';
import type { Project } from '../../app/types/projects';

const project = {
  slug: 'demo',
  title: 'Demo',
  shortDescription: 'Short',
  technologies: [],
} as unknown as Project;

describe('ProjectCard', () => {
  it('shows a focus ring on the whole card on mobile, where the link text is screen-reader only', () => {
    render(<ProjectCard project={project} viewProjectLabel="Ver projeto" />);
    const card = screen.getByRole('article');
    expect(card.className).toContain('max-md:has-[:focus-visible]:outline');
    expect(screen.getByRole('link', { name: 'Ver projeto: Demo' })).toHaveAttribute('href', '/projects/demo');
  });
});
