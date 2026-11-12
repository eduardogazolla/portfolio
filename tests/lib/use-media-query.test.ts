import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { useMediaQuery } from '@/app/lib/use-media-query';

type Listener = () => void;

const mockMatchMedia = (initial: boolean) => {
  let matches = initial;
  const listeners = new Set<Listener>();
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() {
      return matches;
    },
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
  }));
  return (next: boolean) => {
    matches = next;
    listeners.forEach((l) => l());
  };
};

describe('useMediaQuery', () => {
  it('server snapshot is false', () => {
    mockMatchMedia(true);
    const Probe = () => createElement('span', null, String(useMediaQuery('(min-width: 768px)')));
    expect(renderToString(createElement(Probe))).toContain('false');
  });

  it('reads the current match on the client', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates on a change event', () => {
    const change = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    act(() => change(true));
    expect(result.current).toBe(true);
  });
});
