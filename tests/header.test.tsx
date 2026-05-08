import { render, screen } from '@testing-library/react';
import { Header } from '../app/componentes/header/index';

describe('Header', () => {
  it('renders header with navigation', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders home link', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders projects link', () => {
    render(<Header />);
    expect(screen.getByText('Projetos')).toBeInTheDocument();
  });
});