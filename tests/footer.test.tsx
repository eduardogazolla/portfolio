/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { Footer } from '../app/componentes/footer/index';

describe('Footer', () => {
  it('renders footer with text', () => {
    render(<Footer />);
    expect(screen.getByText('Eduardo Gazolla')).toBeInTheDocument();
  });

  it('renders Instagram link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /Eduardo Gazolla/i });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/eduardogazolla/');
  });
});