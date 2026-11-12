/// <reference types="@testing-library/jest-dom" />
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileMenu } from '../../app/componentes/header/mobile-menu';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

const socials = [
  { name: 'GitHub', url: 'https://github.com/eduardogazolla' },
  { name: null, url: 'https://www.linkedin.com/in/eduardogazolla' },
];

const renderMenu = () =>
  render(
    <LanguageProvider>
      <MobileMenu socials={socials} />
    </LanguageProvider>
  );

const openMenu = async () => {
  const user = userEvent.setup();
  const trigger = screen.getByRole('button', { name: 'Menu' });
  await user.click(trigger);
  return { user, trigger };
};

const findCloseButton = (dialog: HTMLElement) =>
  Array.from(dialog.querySelectorAll('button')).find((b) =>
    /^(Fechar|Close)$/.test(b.textContent ?? '')
  ) as HTMLElement;

beforeEach(() => {
  localStorage.clear();
  mockPathname.mockReturnValue('/');
  document.body.style.overflow = '';
});

describe('MobileMenu', () => {
  it('is closed by default', () => {
    renderMenu();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a modal dialog with the links, socials and the contact button', async () => {
    renderMenu();
    const { trigger } = await openMenu();
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);

    const hrefs = Array.from(dialog.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/projects', '/#experience', '/#contact']);
    expect(dialog.querySelector('a[href="https://github.com/eduardogazolla"]')).toBeInTheDocument();
    expect(dialog.querySelector('a[href^="https://www.linkedin.com"]')).toHaveTextContent('LinkedIn');
    const cta = dialog.querySelector('[data-menu-cta]');
    expect(cta).toHaveAttribute('href', '/#contact');
    expect(cta).toHaveTextContent(/Vamos conversar|Let's talk/);
  });

  it('marks the current page link and shows the dot only there', async () => {
    mockPathname.mockReturnValue('/projects');
    renderMenu();
    await openMenu();
    const dialog = await screen.findByRole('dialog');
    const current = dialog.querySelectorAll('nav [aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute('href', '/projects');
    expect(dialog.querySelectorAll('nav [data-current-dot]')).toHaveLength(1);
  });

  it('moves focus into the dialog and traps Tab / Shift+Tab', async () => {
    renderMenu();
    const { user } = await openMenu();
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(first);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it('closes with Escape and returns focus to the Menu button', async () => {
    renderMenu();
    const { user, trigger } = await openMenu();
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with the close button and returns focus to Menu', async () => {
    renderMenu();
    const { user, trigger } = await openMenu();
    const dialog = await screen.findByRole('dialog');
    await user.click(findCloseButton(dialog));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes when a link is clicked', async () => {
    renderMenu();
    const { user } = await openMenu();
    const dialog = await screen.findByRole('dialog');
    await user.click(dialog.querySelector('nav a[href="/projects"]') as HTMLElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('locks body scroll while open and restores it on close and unmount', async () => {
    document.body.style.overflow = 'auto';
    const { unmount } = renderMenu();
    const { user } = await openMenu();
    await screen.findByRole('dialog');
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.body.style.overflow).toBe('auto'));

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await screen.findByRole('dialog');
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not pull focus back into the dialog while it is exiting', async () => {
    renderMenu();
    const { user, trigger } = await openMenu();
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    // The exiting dialog must neither hijack Tab (trap off) nor be reachable (inert).
    expect(fireEvent.keyDown(trigger, { key: 'Tab' })).toBe(true);
    const exiting = screen.queryByRole('dialog', { hidden: true });
    if (exiting) expect(exiting).toHaveAttribute('inert');
  });

  it('makes the page content inert while open and restores it on close', async () => {
    const main = document.createElement('main');
    main.id = 'main';
    document.body.appendChild(main);
    try {
      renderMenu();
      const { user } = await openMenu();
      const dialog = await screen.findByRole('dialog');
      expect(main).toHaveAttribute('inert');
      expect(dialog).not.toHaveAttribute('inert');
      expect(dialog.closest('[inert]')).toBeNull();
      await user.keyboard('{Escape}');
      await waitFor(() => expect(main).not.toHaveAttribute('inert'));
    } finally {
      main.remove();
    }
  });

  it('closes and moves focus to #main when the viewport grows past the mobile layout', async () => {
    const main = document.createElement('main');
    main.id = 'main';
    main.tabIndex = -1;
    document.body.appendChild(main);
    let listener: ((e: { matches: boolean }) => void) | undefined;
    const original = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listener = cb;
      },
      removeEventListener: jest.fn(),
    })) as unknown as typeof window.matchMedia;
    try {
      renderMenu();
      await openMenu();
      await screen.findByRole('dialog');
      act(() => listener?.({ matches: true }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(main).toHaveFocus();
    } finally {
      window.matchMedia = original;
      main.remove();
    }
  });

  it('closes when the contact button is clicked', async () => {
    renderMenu();
    const { user } = await openMenu();
    const dialog = await screen.findByRole('dialog');
    await user.click(dialog.querySelector('[data-menu-cta]') as HTMLElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
