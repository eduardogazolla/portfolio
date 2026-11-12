import { render, screen, act } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { InspectOutline } from '../../app/componentes/inspect-outline';

const renderOutline = (ui: React.ReactElement) =>
  render(
    <LanguageProvider>
      <div data-testid="parent">{ui}</div>
    </LanguageProvider>
  );

beforeEach(() => localStorage.clear());

describe('InspectOutline', () => {
  it('renders only span elements so it is valid inside a heading', () => {
    const { container } = render(
      <LanguageProvider>
        <h1 data-testid="h">
          Title
          <InspectOutline variant="hover" label="h1" measure selector="h1" />
        </h1>
      </LanguageProvider>
    );
    const heading = container.querySelector('[data-testid="h"]')!;
    const tags = Array.from(heading.querySelectorAll('*')).map((e) => e.tagName);
    expect(tags.length).toBeGreaterThan(0);
    expect(new Set(tags)).toEqual(new Set(['SPAN']));
  });

  it('is decorative: root has aria-hidden', () => {
    const { container } = renderOutline(<InspectOutline label="h1" />);
    const root = container.querySelector('[data-testid="parent"]')!.firstElementChild!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('static variant shows the received label', () => {
    renderOutline(<InspectOutline variant="static" label="h1.hero-name" />);
    expect(screen.getByText('h1.hero-name')).toBeInTheDocument();
    expect(screen.getByText('h1.hero-name').className).toMatch(/text-mono-s.*text-on-accent|text-on-accent.*text-mono-s/);
  });

  it('renders no tag when label is omitted', () => {
    const { container } = renderOutline(<InspectOutline />);
    expect(container.querySelector('[data-part="tag"]')).toBeNull();
  });

  it('draws four 8x8 handles', () => {
    const { container } = renderOutline(<InspectOutline />);
    const handles = container.querySelectorAll('[data-part="handle"]');
    expect(handles).toHaveLength(4);
    handles.forEach((h) => expect(h.className).toMatch(/h-2 w-2/));
  });

  it('dashed variant uses a dashed border and the "element not found" tag', async () => {
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
    const { container } = renderOutline(<InspectOutline variant="dashed" />);
    expect(await screen.findByText('elemento não encontrado')).toBeInTheDocument();
    expect(container.querySelector('[data-part="box"]')!.className).toMatch(/border-dashed/);
  });

  it('hover variant is hidden until the parent group is hovered, only with a fine pointer', () => {
    const { container } = renderOutline(<InspectOutline variant="hover" label="h2" />);
    const root = container.querySelector('[data-testid="parent"]')!.firstElementChild!;
    expect(root.className).toMatch(/opacity-0/);
    expect(root.className).toMatch(/hover:hover/);
    expect(root.className).toMatch(/group-hover:opacity-100/);
  });

  describe('measure', () => {
    let callback: () => void = () => {};
    const observe = jest.fn();
    const disconnect = jest.fn();
    const original = global.ResizeObserver;

    const originalMatchMedia = window.matchMedia;
    const mockMatchMedia = (matches: boolean) => {
      window.matchMedia = jest.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
    };

    beforeEach(() => {
      observe.mockClear();
      disconnect.mockClear();
      mockMatchMedia(true);
      global.ResizeObserver = jest.fn((cb: () => void) => {
        callback = cb;
        return { observe, disconnect, unobserve: jest.fn() };
      }) as unknown as typeof ResizeObserver;
    });
    afterEach(() => {
      global.ResizeObserver = original;
      window.matchMedia = originalMatchMedia;
    });

    it('writes "selector W × H" from the parent rect and updates on resize', () => {
      const rect = { width: 1183.6, height: 176.2 };
      const spy = jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(() => rect as DOMRect);
      renderOutline(<InspectOutline measure selector="h1" />);
      expect(screen.getByText('h1 1184 × 176')).toBeInTheDocument();
      rect.width = 600;
      rect.height = 90;
      act(() => callback());
      expect(screen.getByText('h1 600 × 90')).toBeInTheDocument();
      spy.mockRestore();
    });

    it('disconnects the observer on unmount', () => {
      const { unmount } = renderOutline(<InspectOutline measure selector="h1" />);
      expect(observe).toHaveBeenCalledTimes(1);
      unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it('does not observe without a fine hover pointer, but still measures once', () => {
      mockMatchMedia(false);
      renderOutline(<InspectOutline measure selector="h1" />);
      expect(observe).not.toHaveBeenCalled();
      expect(screen.getByText(/^h1 \d+ × \d+$/)).toBeInTheDocument();
    });

    it('does not crash when ResizeObserver is unavailable', () => {
      // @ts-expect-error simulate missing API
      delete global.ResizeObserver;
      renderOutline(<InspectOutline measure selector="h1" />);
      expect(screen.getByText(/^h1 \d+ × \d+$/)).toBeInTheDocument();
    });
  });
});
