/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvDownload } from '../../app/componentes/cv-download';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const renderCv = (props: Parameters<typeof CvDownload>[0] = {}) =>
  render(
    <LanguageProvider>
      <button type="button">outside</button>
      <CvDownload {...props} />
      <button type="button">after</button>
    </LanguageProvider>
  );

const open = async () => {
  const user = userEvent.setup();
  const trigger = screen.getByRole('button', { name: /Baixar currículo|Download CV/ });
  await user.click(trigger);
  return { user, trigger };
};

beforeEach(() => {
  localStorage.clear();
  // jsdom's navigator.language is en-US; the site's default is PT.
  localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
});

describe('CvDownload', () => {
  it('starts closed, with a disclosure button', () => {
    renderCv();
    const trigger = screen.getByRole('button', { name: 'Baixar currículo' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('offers only the PT versions when the site is in PT', async () => {
    renderCv();
    const { trigger } = await open();

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const list = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(list).toBeInTheDocument();

    const qa = screen.getByRole('link', { name: /Currículo QA/ });
    const java = screen.getByRole('link', { name: /Currículo Java/ });
    expect(qa).toHaveAttribute('href', '/cv/eduardo-gazolla-cv-qa-pt.pdf');
    expect(java).toHaveAttribute('href', '/cv/eduardo-gazolla-cv-java-pt.pdf');
    expect(qa).toHaveAttribute('download');
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('offers only the EN versions when the site is in EN', async () => {
    localStorage.setItem('portfolio-gazolla:locale', 'en');
    renderCv();
    await open();

    expect(screen.getByRole('link', { name: /QA CV/ })).toHaveAttribute('href', '/cv/eduardo-gazolla-cv-qa-en.pdf');
    expect(screen.getByRole('link', { name: /Java CV/ })).toHaveAttribute('href', '/cv/eduardo-gazolla-cv-java-en.pdf');
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    renderCv();
    const { user, trigger } = await open();
    await user.tab();
    expect(screen.getByRole('link', { name: /Currículo QA/ })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape even when the trigger did not keep focus (Safari)', async () => {
    renderCv();
    const { user, trigger } = await open();
    (document.activeElement as HTMLElement).blur();
    expect(document.body).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('stays open when focus drops to nothing (a press on the list padding)', async () => {
    renderCv();
    const { user, trigger } = await open();
    const list = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    await user.pointer({ keys: '[MouseLeft]', target: list });
    trigger.blur();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on a click outside', async () => {
    renderCv();
    const { user, trigger } = await open();
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when focus leaves it', async () => {
    renderCv();
    const { user, trigger } = await open();
    await user.tab(); // QA
    await user.tab(); // Java
    await user.tab(); // out of the component
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes after a version is chosen', async () => {
    renderCv();
    const { user, trigger } = await open();
    const qa = screen.getByRole('link', { name: /Currículo QA/ });
    qa.addEventListener('click', (event) => event.preventDefault()); // jsdom can't download
    await user.click(qa);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles closed on a second click', async () => {
    renderCv();
    const { user, trigger } = await open();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the link style and opens upwards when asked', async () => {
    renderCv({ variant: 'link', placement: 'top' });
    const { trigger } = await open();
    const list = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    expect(list.className).toMatch(/bottom-full/);
    expect(trigger.className).not.toMatch(/rounded-full/);
  });
});
