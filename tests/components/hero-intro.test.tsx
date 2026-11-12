/// <reference types="@testing-library/jest-dom" />
import { act, render } from '@testing-library/react';
import { HeroSection } from '../../app/componentes/pages/home/hero-section';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { INTRO_BOOT_SCRIPT, INTRO_STORAGE_KEY } from '../../app/componentes/pages/home/hero-section/intro-flag';
import type { HomePageInfo } from '../../app/types/page-info';

const mockReduce = jest.fn<boolean, []>(() => false);
const mockAnimate = jest.fn(() => ({ cancel: jest.fn(), stop: jest.fn() }));

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockReduce(),
  animate: (...args: unknown[]) => (mockAnimate as (...a: unknown[]) => unknown)(...args),
}));

const homeInfo: HomePageInfo = {
  role: 'Dev',
  introduction: { raw: { children: [{ type: 'paragraph', children: [{ text: 'Bio' }] }] } },
  profilePicture: { url: 'https://media.graphassets.com/portrait.jpg' },
  socials: [],
  knownTechs: [],
  highlightProjects: [],
};

const renderHero = () =>
  render(
    <LanguageProvider>
      <HeroSection homeInfo={homeInfo} currentExperience={null} />
    </LanguageProvider>
  );

const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 120)); });

describe('Hero intro', () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete document.documentElement.dataset.intro;
    mockReduce.mockReturnValue(false);
    mockAnimate.mockClear();
  });

  it('does nothing when the boot script did not request the intro', async () => {
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    const { container } = renderHero();
    await flush();
    expect(mockAnimate).not.toHaveBeenCalled();
    expect(container.querySelector('[data-part="box"]')).toBeNull();
  });

  it('plays once: writes the flag, animates, draws the outline, then clears the attribute', async () => {
    document.documentElement.dataset.intro = 'play';
    const { container } = renderHero();
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1');
    await flush();
    expect(mockAnimate).toHaveBeenCalled();
    expect(container.querySelector('h1 [data-part="box"]')).toBeInTheDocument();
    expect(document.documentElement.dataset.intro).toBe('play');
  });

  it('clears the attribute on unmount so content is never left hidden', async () => {
    document.documentElement.dataset.intro = 'play';
    const { unmount } = renderHero();
    unmount();
    await flush();
    expect(document.documentElement).not.toHaveAttribute('data-intro');
  });

  it('with reduced motion renders no outline and no animation, and shows content', async () => {
    mockReduce.mockReturnValue(true);
    document.documentElement.dataset.intro = 'play';
    const { container } = renderHero();
    await flush();
    expect(container.querySelector('[data-part="box"]')).toBeNull();
    expect(mockAnimate).not.toHaveBeenCalled();
    expect(document.documentElement).not.toHaveAttribute('data-intro');
  });

  it('boot script only sets play for a first, non-reduced visit', () => {
    const run = (reduced: boolean) => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: reduced }) as unknown as typeof window.matchMedia;
      delete document.documentElement.dataset.intro;
      new Function(INTRO_BOOT_SCRIPT)();
      return document.documentElement.dataset.intro;
    };
    expect(run(false)).toBe('play');
    expect(run(true)).toBeUndefined();
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    expect(run(false)).toBeUndefined();
  });
});
