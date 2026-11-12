import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { ScrollStage } from '../../app/componentes/pages/home/highlighted-projects/scroll-stage';

let mockProgress = motionValue(0);
let mockDesktop = true;
let mockReduced = false;
jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useScroll: () => ({ scrollYProgress: mockProgress }),
}));
jest.mock('@/app/lib/use-prefers-reduced-motion', () => ({ usePrefersReducedMotion: () => mockReduced }));
jest.mock('@/app/lib/use-media-query', () => ({ useMediaQuery: () => mockDesktop }));

const setup = () =>
  render(
    <ScrollStage
      media={<div data-testid="media">image</div>}
      text={<div data-testid="text">text</div>}
    />
  );

beforeEach(() => {
  mockProgress = motionValue(0);
  mockDesktop = true;
  mockReduced = false;
});

describe('ScrollStage', () => {
  it('pins the card for 1.5 extra viewports on desktop', () => {
    const { container } = setup();
    expect((container.firstElementChild as HTMLElement).className).toMatch(/:h-\[250svh\]/);
    expect(screen.getByTestId('media').closest('[class*="sticky"]')).not.toBeNull();
  });

  it('starts the image at 0.86 scale with 14px radius, and the text hidden', () => {
    setup();
    const frame = screen.getByTestId('media').parentElement!;
    const style = frame.getAttribute('style') ?? '';
    expect(style).toMatch(/scale\(0\.86\)/);
    expect(style).toMatch(/clip-path:\s*inset\(0px round 14px\)/);
    expect(screen.getByTestId('text').parentElement!.getAttribute('style') ?? '').toMatch(/opacity:\s*0/);
  });

  it('only animates transform, opacity and clip-path', () => {
    const { container } = setup();
    const styles = Array.from(container.querySelectorAll('[style]')).map((el) => el.getAttribute('style'));
    styles.join(';').split(';').filter(Boolean).forEach((decl) => {
      expect(decl.split(':')[0].trim()).toMatch(/^(transform|opacity|clip-path|will-change)$/);
    });
  });

  it.each([
    ['below md or short viewports', () => { mockDesktop = false; }],
    ['reduced motion', () => { mockReduced = true; }],
  ])('has no inline styles and nothing inert on %s', (_n, apply) => {
    apply();
    const { container } = setup();
    expect(container.querySelector('[style]')).toBeNull();
    expect(container.querySelector('[inert]')).toBeNull();
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('text')).toBeInTheDocument();
  });

  it('keeps the same media node across the static -> active switch (no remount)', () => {
    mockDesktop = false;
    const { rerender } = setup();
    const before = screen.getByTestId('media');
    mockDesktop = true;
    rerender(<ScrollStage media={<div data-testid="media">image</div>} text={<div data-testid="text">text</div>} />);
    expect(screen.getByTestId('media')).toBe(before);
  });

  it('never makes the text inert, so Tab can reach it while it is faded out', () => {
    setup();
    expect(screen.getByTestId('text').parentElement!).not.toHaveAttribute('inert');
  });

  it('shows the text at once when focus enters it, and hands back to scroll on blur', async () => {
    setup();
    const wrapper = screen.getByTestId('text').parentElement!;
    expect(wrapper.getAttribute('style') ?? '').toMatch(/opacity:\s*0/);
    fireEvent.focusIn(screen.getByTestId('text'));
    await waitFor(() => expect(wrapper.getAttribute('style') ?? '').toMatch(/opacity:\s*1/));
    fireEvent.focusOut(screen.getByTestId('text'));
    await waitFor(() => expect(wrapper.getAttribute('style') ?? '').toMatch(/opacity:\s*0/));
  });
});
