import { act, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { BackToTop } from '../../app/componentes/back-to-top';

const mockReduced = jest.fn(() => false);
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react');
  return { ...actual, useReducedMotion: () => mockReduced() };
});

const setScroll = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
};

beforeEach(() => {
  localStorage.clear();
  mockReduced.mockReturnValue(false);
  Object.defineProperty(window.navigator, 'language', { value: 'pt-BR', configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  window.scrollTo = jest.fn();
  document.body.innerHTML = '';
});

const setup = () => {
  const main = document.createElement('main');
  main.id = 'main';
  main.tabIndex = -1;
  document.body.appendChild(main);
  return render(
    <LanguageProvider>
      <BackToTop />
    </LanguageProvider>,
    { container: document.body.appendChild(document.createElement('div')) }
  );
};

describe('BackToTop', () => {
  it('is hidden at the top', () => {
    setup();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('appears only after 1.5 x the viewport height', () => {
    setup();
    setScroll(1200);
    expect(screen.queryByRole('button')).toBeNull();
    setScroll(1201);
    expect(screen.getByRole('button', { name: 'Voltar ao topo' })).toBeInTheDocument();
  });

  it('uses the English name for the en locale', () => {
    localStorage.setItem('portfolio-gazolla:locale', 'en');
    setup();
    setScroll(2000);
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });

  it('is positioned with static classes and never animates top/right', () => {
    setup();
    setScroll(2000);
    const wrapper = screen.getByRole('button').parentElement!;
    expect(wrapper.className).toMatch(/fixed/);
    expect(wrapper.className).toMatch(/right-4/);
    expect(wrapper.className).toMatch(/bottom-4/);
    expect(wrapper.getAttribute('style') ?? '').not.toMatch(/\b(top|right|bottom|left)\s*:/);
  });

  it('scrolls to top smoothly and moves focus to #main without scrolling', () => {
    setup();
    setScroll(2000);
    const main = document.getElementById('main')!;
    const focus = jest.spyOn(main, 'focus');
    fireEvent.click(screen.getByRole('button'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('scrolls instantly under reduced motion', () => {
    mockReduced.mockReturnValue(true);
    setup();
    setScroll(2000);
    fireEvent.click(screen.getByRole('button'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });

  it('registers a passive scroll listener and removes the same one on unmount', () => {
    const add = jest.spyOn(window, 'addEventListener');
    const remove = jest.spyOn(window, 'removeEventListener');
    const { unmount } = setup();
    const call = add.mock.calls.find(([type]) => type === 'scroll')!;
    expect(call[2]).toEqual({ passive: true });
    unmount();
    expect(remove).toHaveBeenCalledWith('scroll', call[1]);
    add.mockRestore();
    remove.mockRestore();
  });
});
