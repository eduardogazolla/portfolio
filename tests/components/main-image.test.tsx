/// <reference types="@testing-library/jest-dom" />
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { MainImage } from '../../app/componentes/pages/project/project-details/main-image';

const mockMatchMedia = (reduced: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
};

const drifting = (container: HTMLElement) => container.querySelector('div > div') as HTMLElement;

describe('MainImage', () => {
  afterEach(() => {
    // @ts-expect-error restore the jsdom default (no matchMedia)
    delete window.matchMedia;
  });

  it('keeps the transform static under reduced motion', () => {
    mockMatchMedia(true);
    const { container } = render(<MainImage src="https://example.com/a.png" alt="x" />);
    const { transform } = drifting(container).style;
    expect(transform).not.toMatch(/scale\(1\.08\)/);
    expect(transform).toMatch(/translateY\(0px\)|none|^$/);
  });

  it('server markup does not depend on the reduced-motion preference', () => {
    const html = (reduced: boolean) => {
      mockMatchMedia(reduced);
      return renderToString(<MainImage src="https://example.com/a.png" alt="x" />);
    };
    expect(html(true)).toBe(html(false));
  });
});
