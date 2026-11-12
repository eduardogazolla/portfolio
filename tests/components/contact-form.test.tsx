/// <reference types="@testing-library/jest-dom" />
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../../app/componentes/contact-form';
import { LanguageProvider, useLanguage } from '../../app/componentes/context/language-context';

const copy = {
  'pt-BR': {
    name: 'Nome', email: 'E-mail', message: 'Mensagem',
    submit: 'Enviar mensagem', submitting: 'Enviando…', sent: 'Mensagem enviada.',
    another: 'Enviar outra mensagem', failed: 'Não consegui enviar agora.', retry: 'Tentar de novo',
    nameRequired: 'Diga seu nome para eu saber com quem falo.',
    emailMissingTld: 'Falta o final do domínio, como .com. Use algo como nome@gmail.com.',
  },
  en: {
    name: 'Name', email: 'Email', message: 'Message',
    submit: 'Send message', submitting: 'Sending…', sent: 'Message sent.',
    another: 'Send another message', failed: 'I could not send it right now.', retry: 'Try again',
    nameRequired: 'Tell me your name so I know who I am talking to.',
    emailMissingTld: 'The domain ending is missing, such as .com. Use something like name@gmail.com.',
  },
} as const;

type Copy = (typeof copy)[keyof typeof copy];
type User = ReturnType<typeof userEvent.setup>;
type Deferred = { resolve: (r: unknown) => void; reject: (e: unknown) => void };

// Each fetch call stays pending until the test settles it.
const mockFetch = () => {
  const calls: Deferred[] = [];
  const fn = jest.fn(() => new Promise((resolve, reject) => calls.push({ resolve, reject })));
  global.fetch = fn as unknown as typeof fetch;
  return { fn, calls };
};

const respond = (ok: boolean, body: unknown, status = ok ? 200 : 502) => ({
  ok,
  status,
  json: async () => body,
});

// Settles a pending fetch inside act so React state updates are flushed.
const settle = (call: Deferred, value: unknown, fail = false) =>
  act(async () => {
    if (fail) call.reject(value);
    else call.resolve(value);
  });

const LocaleSwitch = () => {
  const { setLocale } = useLanguage();
  return <button onClick={() => setLocale('en')}>to-en</button>;
};

const linkedIn = { name: 'LinkedIn', url: 'https://www.linkedin.com/in/eduardo' };

const setup = (locale: keyof typeof copy, socials: { name?: string | null; url: string }[] = []) => {
  localStorage.clear();
  localStorage.setItem('portfolio-gazolla:locale', locale);
  const user = userEvent.setup();
  render(
    <LanguageProvider>
      <ContactForm socials={socials} />
      <LocaleSwitch />
    </LanguageProvider>
  );
  return { user, t: copy[locale] };
};

const fillValid = async (user: User, t: Copy) => {
  await user.type(screen.getByLabelText(t.name), 'Maria Silva');
  await user.type(screen.getByLabelText(t.email), 'maria@empresa.com');
  await user.type(screen.getByLabelText(t.message), 'Oi, Eduardo!');
};

describe.each(['pt-BR', 'en'] as const)('ContactForm (%s)', (locale) => {
  it('invalid: shows errors under the fields and focuses the first invalid one', async () => {
    const { fn } = mockFetch();
    const { user, t } = setup(locale);
    await user.type(screen.getByLabelText(t.email), 'maria@empresa');
    await user.click(screen.getByRole('button', { name: t.submit }));

    const name = screen.getByLabelText(t.name);
    expect(await screen.findByText(t.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(t.emailMissingTld)).toBeInTheDocument();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
    expect(fn).not.toHaveBeenCalled();
  });

  it('invalid: the error clears once fixed and blurred', async () => {
    mockFetch();
    const { user, t } = setup(locale);
    await user.click(screen.getByRole('button', { name: t.submit }));
    const name = screen.getByLabelText(t.name);
    await screen.findByText(t.nameRequired);
    await user.type(name, 'Maria Silva');
    await user.tab();
    await waitFor(() => expect(screen.queryByText(t.nameRequired)).not.toBeInTheDocument());
    expect(name).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('honeypot: hidden from keyboard and assistive tech, empty by default', async () => {
    mockFetch();
    const { t } = setup(locale);
    const hp = document.querySelector('input[name="company_url"]') as HTMLInputElement;
    expect(hp).toBeInTheDocument();
    expect(hp).toHaveAttribute('tabindex', '-1');
    expect(hp).toHaveAttribute('autocomplete', 'off');
    expect(hp.value).toBe('');
    expect(hp.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(hp.closest('[inert]')).not.toBeNull();
    expect(screen.queryByLabelText(t.name)).not.toBe(hp);
  });

  it('honeypot: a real submission never sends a company_url value', async () => {
    const { fn, calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
    const sent = JSON.parse((fn.mock.calls[0] as unknown as [string, { body: string }])[1].body);
    expect(sent.company_url ?? '').toBe('');
    await settle(calls[0], respond(true, { ok: true }));
  });

  it('honeypot: when filled, nothing is sent and the form looks successful', async () => {
    const { fn } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    const hp = document.querySelector('input[name="company_url"]') as HTMLInputElement;
    await user.type(hp, 'http://spam.example');
    await user.click(screen.getByRole('button', { name: t.submit }));
    expect(await screen.findByRole('heading', { name: t.sent })).toBeInTheDocument();
    expect(fn).not.toHaveBeenCalled();
  });

  it('shows the message length against the limit', async () => {
    mockFetch();
    const { user, t } = setup(locale);
    const message = screen.getByLabelText(t.message);
    expect(message).toHaveAttribute('maxlength', '500');
    expect(screen.getByText('0/500')).toBeInTheDocument();
    await user.type(message, 'abc');
    expect(screen.getByText('3/500')).toBeInTheDocument();
  });

  it('submitting: disables fields, marks the button busy and shows the loading label', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));

    const button = await screen.findByRole('button', { name: t.submitting });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText(t.name)).toBeDisabled();
    expect(screen.getByLabelText(t.email)).toBeDisabled();
    expect(screen.getByLabelText(t.message)).toBeDisabled();
    expect(calls).toHaveLength(1);
  });

  it('sends the payload once, even on a double click', async () => {
    const { fn } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.dblClick(screen.getByRole('button', { name: t.submit }));

    await screen.findByRole('button', { name: t.submitting });
    expect(fn).toHaveBeenCalledTimes(1);
    const [url, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Maria Silva',
      email: 'maria@empresa.com',
      message: 'Oi, Eduardo!',
    });
  });

  it('sent: shows the confirmation with focus on its heading, then returns to an empty form', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await settle(calls[0], respond(true, { ok: true }));

    const heading = await screen.findByRole('heading', { name: t.sent });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.queryByLabelText(t.name)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: t.another }));
    expect(screen.getByLabelText(t.name)).toHaveValue('');
    expect(screen.getByLabelText(t.email)).toHaveValue('');
    expect(screen.getByLabelText(t.message)).toHaveValue('');
    expect(screen.getByLabelText(t.name)).toHaveFocus();
  });

  it('submitting: the submit button keeps focus', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    const button = await screen.findByRole('button', { name: t.submitting });
    expect(button).toHaveFocus();
    await user.click(button);
    expect(calls).toHaveLength(1);
    await settle(calls[0], respond(true, { ok: true }));
  });

  it('submitting: pressing Enter in a field moves focus to the submit button', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.type(screen.getByLabelText(t.name), '{Enter}');
    const button = await screen.findByRole('button', { name: t.submitting });
    expect(button).toHaveFocus();
    expect(screen.getByLabelText(t.name)).toBeDisabled();
    await settle(calls[0], respond(true, { ok: true }));
  });

  it('the live region announces the submission but not the confirmation', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    const region = document.querySelector('[aria-live]') as HTMLElement;
    await waitFor(() => expect(region.textContent).not.toBe(''));
    await settle(calls[0], respond(true, { ok: true }));
    await screen.findByRole('heading', { name: t.sent });
    expect(region.textContent).toBe('');
  });

  it('re-translates visible errors when the language changes', async () => {
    mockFetch();
    const { user, t } = setup(locale);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await screen.findByText(t.nameRequired);
    await user.click(screen.getByRole('button', { name: 'to-en' }));
    expect(await screen.findByText(copy.en.nameRequired)).toBeInTheDocument();
    if (locale === 'pt-BR') expect(screen.queryByText(copy['pt-BR'].nameRequired)).not.toBeInTheDocument();
  });

  it('failed: LinkedIn in the notice is a new-tab link when the CMS has one', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale, [{ name: 'GitHub', url: 'https://github.com/x' }, linkedIn]);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await settle(calls[0], respond(false, { ok: false }, 502));
    const alert = await screen.findByRole('alert');
    const link = within(alert).getByRole('link', { name: /LinkedIn/ });
    expect(link).toHaveAttribute('href', linkedIn.url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('failed: LinkedIn stays plain text without a LinkedIn social', async () => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale, [{ name: 'GitHub', url: 'https://github.com/x' }]);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await settle(calls[0], respond(false, { ok: false }, 502));
    const alert = await screen.findByRole('alert');
    expect(within(alert).queryByRole('link')).not.toBeInTheDocument();
    expect(alert).toHaveTextContent('LinkedIn');
  });

  it('a request that times out ends in the failed state', async () => {
    const controller = new AbortController();
    const timeout = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
    global.fetch = jest.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'TimeoutError')));
        })
    ) as unknown as typeof fetch;
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await screen.findByRole('button', { name: t.submitting });
    expect(timeout).toHaveBeenCalledWith(15000);
    act(() => controller.abort());
    expect(await screen.findByRole('alert')).toHaveTextContent(t.failed);
    timeout.mockRestore();
  });

  it.each([
    ['200 with ok:false', respond(true, { ok: false, error: 'delivery_failed' })],
    ['a non-OK status', respond(false, { ok: false, error: 'delivery_failed' }, 502)],
    ['an unreadable body', { ok: false, status: 500, json: async () => { throw new Error('bad'); } }],
  ])('failed on %s: keeps the data, alerts and offers a retry', async (_label, response) => {
    const { calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await settle(calls[0], response);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(t.failed);
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByLabelText(t.name)).toHaveValue('Maria Silva');
    expect(screen.getByLabelText(t.name)).toBeEnabled();
    expect(screen.getByLabelText(t.message)).toHaveValue('Oi, Eduardo!');
    expect(screen.getByRole('button', { name: t.retry })).toBeEnabled();
  });

  it('failed on a network error, then "retry" submits again and can succeed', async () => {
    const { fn, calls } = mockFetch();
    const { user, t } = setup(locale);
    await fillValid(user, t);
    await user.click(screen.getByRole('button', { name: t.submit }));
    await settle(calls[0], new TypeError('network'), true);

    await user.click(await screen.findByRole('button', { name: t.retry }));
    expect(await screen.findByRole('button', { name: t.submitting })).toHaveAttribute('aria-disabled', 'true');
    expect(fn).toHaveBeenCalledTimes(2);
    await settle(calls[1], respond(true, { ok: true }));
    expect(await screen.findByRole('heading', { name: t.sent })).toBeInTheDocument();
  });
});
