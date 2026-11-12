import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RootLayout from '../app/layout';

jest.mock('../app/globals.css', () => ({}), { virtual: true });
jest.mock('next/font/google', () => {
  const font = () => ({ variable: 'font-var' });
  return { Bricolage_Grotesque: font, Geist: font, IBM_Plex_Mono: font };
});
jest.mock('../app/componentes/header', () => ({ Header: () => <header data-testid="header"><a href="/x">nav</a></header> }));
jest.mock('../app/componentes/contact-form', () => ({ ContactForm: () => <section data-testid="contact" /> }));
jest.mock('../app/componentes/footer', () => ({ Footer: () => <footer data-testid="footer" /> }));
jest.mock('../app/componentes/toaster', () => ({ Toaster: () => null }));
jest.mock('../app/componentes/back-to-top', () => ({
  BackToTop: () => <button data-testid="back-to-top" type="button">top</button>,
}));

// RootLayout returns <html>, which React 19 hoists onto the jsdom document, so we render it
// into the test document directly and query document.body.
describe('RootLayout', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <RootLayout>
        <p>page</p>
      </RootLayout>,
      { container: document, baseElement: document.body }
    );
  });
  afterEach(() => jest.restoreAllMocks());

  it('makes the skip link to #main the first focusable element', async () => {
    await userEvent.tab();
    expect(document.activeElement).toHaveAttribute('href', '#main');
  });

  it('has exactly one main#main that is programmatically focusable', () => {
    const mains = document.querySelectorAll('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main');
    expect(mains[0]).toHaveAttribute('tabindex', '-1');
  });

  it('places BackToTop after the footer in DOM order', () => {
    const footer = document.querySelector('[data-testid="footer"]')!;
    const back = document.querySelector('[data-testid="back-to-top"]')!;
    expect(footer.compareDocumentPosition(back) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
