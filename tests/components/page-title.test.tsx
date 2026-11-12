/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import { PageTitle } from '../../app/componentes/page-title';

describe('PageTitle', () => {
  it('renders an h1 at Display/XL (96px mobile, 176px desktop) with the hover outline', () => {
    const { container } = render(
      <LanguageProvider>
        <PageTitle title="Hour Sync" />
      </LanguageProvider>
    );
    const h1 = screen.getByRole('heading', { level: 1, name: 'Hour Sync' });
    expect(h1.className).toMatch(/text-\[96px\]/);
    expect(h1.className).toMatch(/md:text-display-xl/);
    expect(h1.className).toMatch(/break-words/);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
