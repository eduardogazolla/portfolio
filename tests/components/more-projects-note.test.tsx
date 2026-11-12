/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { MoreProjectsNote } from '../../app/componentes/more-projects-note';
import { LanguageProvider } from '../../app/componentes/context/language-context';

const socials = [{ name: 'GitHub', url: 'https://github.com/x' }];

const renderNote = (props: Partial<React.ComponentProps<typeof MoreProjectsNote>> = {}) =>
  render(
    <LanguageProvider>
      <MoreProjectsNote socials={socials} {...props} />
    </LanguageProvider>
  );

describe('MoreProjectsNote', () => {
  it('shows the note and the GitHub link', () => {
    renderNote();
    expect(screen.getByText(/More projects coming/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/x');
  });

  it('omits the link without a GitHub social and renders extra children', () => {
    renderNote({ socials: [], children: <button type="button">todos</button> });
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "todos" })).toBeInTheDocument();
  });
});
