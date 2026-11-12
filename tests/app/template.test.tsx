import type { ComponentType, ReactNode } from 'react';

// The template keeps module state ("first page of the visit already mounted"), so each test loads a
// fresh copy of it, together with the React/RTL copies that copy needs to share one React instance.
let Template: ComponentType<{ children: ReactNode }>;
let render: typeof import('@testing-library/react/pure').render;
let screen: typeof import('@testing-library/react/pure').screen;
let cleanup: typeof import('@testing-library/react/pure').cleanup;
let renderToString: typeof import('react-dom/server').renderToString;

const mockReduced = jest.fn(() => false);
jest.mock('@/app/lib/use-prefers-reduced-motion', () => ({ usePrefersReducedMotion: () => mockReduced() }));

afterEach(() => cleanup());

/* eslint-disable @typescript-eslint/no-require-imports -- isolateModules needs require */
beforeEach(() => {
  mockReduced.mockReturnValue(false);
  jest.isolateModules(() => {
    Template = require('../../app/template').default;
    ({ render, screen, cleanup } = require('@testing-library/react/pure')); // pure: no auto-registered hooks
    ({ renderToString } = require('react-dom/server'));
  });
});

describe('page template', () => {
  it('server HTML is never hidden, so content shows without JS', () => {
    const html = renderToString(<Template><p>content</p></Template>);
    expect(html).not.toMatch(/opacity:\s*0/);
    expect(html).not.toMatch(/translate/);
  });

  it('does not animate the first page of the visit (the hero intro owns it)', () => {
    render(<Template><p>content</p></Template>);
    const style = screen.getByText('content').parentElement!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/opacity:\s*0/);
    expect(style).not.toMatch(/translate/);
  });

  it('renders its children', () => {
    render(<Template><p>content</p></Template>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('starts hidden and 8px down on later navigations', () => {
    const first = render(<Template><p>a</p></Template>);
    first.unmount();
    render(<Template><p>b</p></Template>);
    const style = screen.getByText('b').parentElement!.getAttribute('style') ?? '';
    expect(style).toMatch(/opacity:\s*0/);
    expect(style).toMatch(/translateY\(8px\)|translate3d\(0px,\s*8px/);
  });

  it('only fades (no y) with reduced motion', () => {
    mockReduced.mockReturnValue(true);
    render(<Template><p>a</p></Template>).unmount();
    render(<Template><p>b</p></Template>);
    const style = screen.getByText('b').parentElement!.getAttribute('style') ?? '';
    expect(style).toMatch(/opacity:\s*0/);
    expect(style).not.toMatch(/translate/);
  });
});
