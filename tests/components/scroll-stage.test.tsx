import { render, screen } from '@testing-library/react';
import { ScrollStage } from '../../app/componentes/pages/home/highlighted-projects/scroll-stage';

let mockDesktop = true;
let mockReduced = false;
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
  mockDesktop = true;
  mockReduced = false;
});

describe('ScrollStage', () => {
  it('pins the card for 1.5 viewports on mockDesktop', () => {
    const { container } = setup();
    expect((container.firstElementChild as HTMLElement).className).toMatch(/h-\[250svh\]/);
    expect(screen.getByTestId('media').closest('.sticky')).not.toBeNull();
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
    ['below md', () => { mockDesktop = false; }],
    ['reduced motion', () => { mockReduced = true; }],
  ])('is static (no sticky, no inline styles) on %s', (_n, apply) => {
    apply();
    const { container } = setup();
    expect(container.querySelector('.sticky')).toBeNull();
    expect(container.querySelector('[style]')).toBeNull();
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('text')).toBeInTheDocument();
  });
});
