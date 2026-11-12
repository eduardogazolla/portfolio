import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import Template from '../../app/template';

const mockReduced = jest.fn(() => false);
jest.mock('@/app/lib/use-prefers-reduced-motion', () => ({ usePrefersReducedMotion: () => mockReduced() }));

beforeEach(() => mockReduced.mockReturnValue(false));

// Order matters: the template keeps module state ("first page of the visit already mounted").
describe('page template', () => {
  it('server HTML is never hidden, so content shows without JS', () => {
    const html = renderToString(<Template><p>content</p></Template>);
    expect(html).not.toMatch(/opacity:\s*0/);
    expect(html).not.toMatch(/translate/);
  });

  it('does not animate the first page of the visit (the hero intro owns it)', () => {
    render(<Template><p>content</p></Template>);
    expect(screen.getByText('content').parentElement!.getAttribute('style') ?? '').not.toMatch(/opacity:\s*0/);
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
