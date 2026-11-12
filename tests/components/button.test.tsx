import { render, screen } from '@testing-library/react';
import { Button } from '../../app/componentes/button';

describe('Button', () => {
  it('renders a button, primary by default, with accent colors', () => {
    render(<Button>Vamos conversar</Button>);
    const btn = screen.getByRole('button', { name: 'Vamos conversar' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn.className).toMatch(/bg-accent/);
    expect(btn.className).toMatch(/text-on-accent/);
  });

  it('secondary has a line border and no accent background', () => {
    render(<Button variant="secondary">Ver</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toMatch(/border-line/);
    expect(cls).not.toMatch(/bg-accent/);
  });

  it('allows submit type', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('loading disables, sets aria-busy and shows an aria-hidden spinner with text', () => {
    render(<Button loading>Enviando…</Button>);
    const btn = screen.getByRole('button', { name: 'Enviando…' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    const spinner = btn.querySelector('[data-spinner]');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner?.className).toMatch(/motion-safe:animate-spin/);
  });

  it('is not busy when idle', () => {
    render(<Button>Ok</Button>);
    const btn = screen.getByRole('button');
    expect(btn).not.toHaveAttribute('aria-busy');
    expect(btn.querySelector('[data-spinner]')).toBeNull();
  });

  it('presses with scale(0.97) via transform at duration-fast, off under reduced motion', () => {
    render(<Button>Ok</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toMatch(/active:scale-\[0\.97\]/);
    expect(cls).toMatch(/transition-transform/);
    expect(cls).toMatch(/duration-fast/);
    expect(cls).toMatch(/motion-reduce:active:scale-100/);
  });

  it('renders as a link when given href', () => {
    render(<Button href="/projects">Projetos</Button>);
    const link = screen.getByRole('link', { name: 'Projetos' });
    expect(link).toHaveAttribute('href', '/projects');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('link mode opens external urls safely in a new tab', () => {
    render(<Button href="https://github.com/x" target="_blank">Repo</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('merges a custom className', () => {
    render(<Button className="extra">Ok</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra');
  });
});
