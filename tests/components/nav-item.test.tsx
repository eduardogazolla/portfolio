import { render, screen } from '@testing-library/react';
import { NavItem } from '../../app/componentes/header/nav-item';

const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('NavItem', () => {
  it('renders a link with the label', () => {
    mockPathname.mockReturnValue('/projects');
    render(<NavItem label="Home" href="/" />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('marks the current page with aria-current and a decorative accent dot', () => {
    mockPathname.mockReturnValue('/projects');
    render(<NavItem label="Projects" href="/projects" />);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveAttribute('aria-current', 'page');
    const dot = link.querySelector('[aria-hidden="true"]');
    expect(dot).not.toBeNull();
    expect(dot?.className).toMatch(/bg-accent/);
  });

  it('does not mark other pages as current nor show the dot', () => {
    mockPathname.mockReturnValue('/');
    render(<NavItem label="Projects" href="/projects" />);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('uses muted text that becomes text on hover and when current', () => {
    mockPathname.mockReturnValue('/');
    const { rerender } = render(<NavItem label="Projects" href="/projects" />);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link.className).toMatch(/text-text-muted/);
    expect(link.className).toMatch(/hover:text-text/);
    mockPathname.mockReturnValue('/projects');
    rerender(<NavItem label="Projects" href="/projects" />);
    expect(screen.getByRole('link', { name: 'Projects' }).className).toMatch(/(^|\s)text-text(\s|$)/);
  });
});

describe('NavItem on nested routes', () => {
  it('stays current on child paths of its href', () => {
    mockPathname.mockReturnValue('/projects/hour-sync');
    render(<NavItem label="Projects" href="/projects" />);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark Home or hash links current on a child path', () => {
    mockPathname.mockReturnValue('/projects/hour-sync');
    render(
      <>
        <NavItem label="Home" href="/" />
        <NavItem label="Contact" href="/#contact" />
      </>
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
  });

  it('does not match sibling prefixes', () => {
    mockPathname.mockReturnValue('/projectsx');
    render(<NavItem label="Projects" href="/projects" />);
    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute('aria-current');
  });
});
