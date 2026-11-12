import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { SectionTitle } from '../../app/componentes/section-title';

const renderTitle = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('SectionTitle', () => {
  it('renders an h2 by default', () => {
    renderTitle(<SectionTitle title="Stack" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument();
  });

  it('allows configuring the heading level', () => {
    renderTitle(<SectionTitle title="Projetos" as="h3" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Projetos' })).toBeInTheDocument();
  });

  it('uses the display font with the fluid clamp size', () => {
    renderTitle(<SectionTitle title="Stack" />);
    const heading = screen.getByRole('heading');
    expect(heading.className).toMatch(/font-display/);
    expect(heading.className).toContain('clamp(64px,8vw_+_1rem,112px)');
  });

  it('renders an optional muted subtitle', () => {
    renderTitle(<SectionTitle title="Stack" subtitle="Tecnologias que uso" />);
    const subtitle = screen.getByText('Tecnologias que uso');
    expect(subtitle.className).toMatch(/text-text-muted/);
  });

  it('renders no subtitle when omitted', () => {
    const { container } = renderTitle(<SectionTitle title="Stack" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('draws a hover InspectOutline with measure on the heading group, hidden from the a11y tree', () => {
    renderTitle(<SectionTitle title="Stack" />);
    const heading = screen.getByRole('heading');
    expect(heading.className).toMatch(/\bgroup\b/);
    expect(heading.className).toMatch(/\brelative\b/);
    const outline = heading.querySelector('[aria-hidden="true"]')!;
    expect(outline.className).toMatch(/group-hover:opacity-100/);
    expect(outline.className).toMatch(/hover:hover/);
    expect(heading).toHaveAccessibleName('Stack');
  });
});
