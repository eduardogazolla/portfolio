import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { Link } from '../../app/componentes/link';

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window.navigator, 'language', { value: 'pt-BR', configurable: true });
});

const setup = (ui: React.ReactElement) => render(<LanguageProvider>{ui}</LanguageProvider>);

describe('Link', () => {
  it('internal link has no new-tab behavior and no arrow by default', () => {
    setup(<Link href="/projects">Projetos</Link>);
    const link = screen.getByRole('link', { name: 'Projetos' });
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(link.querySelector('[data-arrow]')).toBeNull();
  });

  it('external link opens in a new tab safely with a decorative arrow', () => {
    setup(<Link href="https://github.com/x">Repo</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const arrow = link.querySelector('[data-arrow]');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(arrow).toHaveTextContent('↗');
  });

  it('external link exposes localized "(abre em nova aba)" text, visually hidden', () => {
    setup(<Link href="https://github.com/x">Repo</Link>);
    const link = screen.getByRole('link', { name: 'Repo (abre em nova aba)' });
    expect(screen.getByText('(abre em nova aba)')).toHaveClass('sr-only');
    expect(link).toBeInTheDocument();
  });

  it('uses English text when locale is en', () => {
    localStorage.setItem('portfolio-gazolla:locale', 'en');
    setup(<Link href="https://github.com/x">Repo</Link>);
    expect(screen.getByRole('link', { name: 'Repo (opens in a new tab)' })).toBeInTheDocument();
  });

  it('the arrow moves 2px diagonally on hover only for hover-capable fine pointers', () => {
    setup(<Link href="https://github.com/x">Repo</Link>);
    const cls = screen.getByRole('link').querySelector('[data-arrow]')!.className;
    expect(cls).toMatch(/\[@media\(hover:hover\)_and_\(pointer:fine\)\]:group-hover:translate-x-\[2px\]/);
    expect(cls).toMatch(/\[@media\(hover:hover\)_and_\(pointer:fine\)\]:group-hover:-translate-y-\[2px\]/);
    expect(cls).toMatch(/motion-reduce:transform-none/);
  });

  it('arrow prop shows the arrow on an internal link without new-tab text', () => {
    setup(<Link href="/projects" arrow>Ver todos</Link>);
    const link = screen.getByRole('link', { name: 'Ver todos' });
    expect(link.querySelector('[data-arrow]')).toBeInTheDocument();
    expect(link).not.toHaveAttribute('target');
  });

  it('merges a custom className', () => {
    setup(<Link href="/" className="extra">Home</Link>);
    expect(screen.getByRole('link')).toHaveClass('extra');
  });

  it.each(['mailto:a@b.co', 'tel:+5511999999999'])('%s is a plain anchor with no new tab, hint or arrow', (href) => {
    setup(<Link href={href}>Contato</Link>);
    const link = screen.getByRole('link', { name: 'Contato' });
    expect(link).toHaveAttribute('href', href);
    expect(link).not.toHaveAttribute('target');
    expect(link.querySelector('[data-arrow]')).toBeNull();
  });

  it('protocol-relative urls are external', () => {
    setup(<Link href="//example.com/x">Ext</Link>);
    const link = screen.getByRole('link', { name: 'Ext (abre em nova aba)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
