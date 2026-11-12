/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Footer } from '../app/componentes/footer/index';
import { LanguageProvider } from '../app/componentes/context/language-context';

const socials = [
  { name: 'GitHub', url: 'https://github.com/eduardogazolla' },
  { name: null, url: 'https://www.linkedin.com/in/eduardogazolla' },
];

const renderFooter = (props: Partial<React.ComponentProps<typeof Footer>> = {}) =>
  render(
    <LanguageProvider>
      <Footer socials={socials} {...props} />
    </LanguageProvider>
  );

describe('Footer', () => {
  afterEach(() => jest.useRealTimers());

  it('renders the copyright with the current year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2031-06-15T12:00:00Z'));
    renderFooter();
    expect(screen.getByText('© 2031 Eduardo Gazolla')).toBeInTheDocument();
  });

  it('renders the CMS socials with labels, opening in a new tab', () => {
    renderFooter();
    const github = screen.getByRole('link', { name: /^GitHub/ });
    expect(github).toHaveAttribute('href', 'https://github.com/eduardogazolla');
    expect(github).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /^LinkedIn/ })).toBeInTheDocument();
  });

  it('renders no social links when there are none', () => {
    renderFooter({ socials: [] });
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
