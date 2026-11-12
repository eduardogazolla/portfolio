import { render, screen } from '@testing-library/react';
import { TechBadge } from '../../app/componentes/tech-badge';

describe('TechBadge', () => {
  it('renders the technology name', () => {
    render(<TechBadge name="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('is a pill with a line border and label-m text', () => {
    render(<TechBadge name="React" />);
    const cls = screen.getByText('React').className;
    expect(cls).toMatch(/rounded-full/);
    expect(cls).toMatch(/border-line/);
    expect(cls).toMatch(/text-label-m/);
  });

  it('has no entrance animation from scale(0)', () => {
    render(<TechBadge name="React" />);
    const el = screen.getByText('React');
    expect(el.getAttribute('style') ?? '').not.toMatch(/scale/);
    expect(el.className).not.toMatch(/scale/);
  });

  it('merges a custom className', () => {
    render(<TechBadge name="React" className="extra" />);
    expect(screen.getByText('React')).toHaveClass('extra');
  });
});
