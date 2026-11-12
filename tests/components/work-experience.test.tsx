/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkExperience } from '../../app/componentes/pages/home/work-experiences';
import { LanguageProvider } from '../../app/componentes/context/language-context';
import type { WorkExperience as IWorkExperience } from '../../app/types/work-experience';

const richText = (text: string): NonNullable<IWorkExperience['description']> => ({
  raw: { children: [{ type: 'paragraph', children: [{ text }] }] } as never,
});

const current: IWorkExperience = {
  role: 'Analista de Testes',
  companyName: 'DB1 Global Software',
  companyUrl: 'https://www.db1.com.br',
  startDate: '2025-02-01',
  endDate: null,
  technologies: [{ name: 'MongoDB' }, { name: 'Postman' }],
  description: richText('Garanto que o software atenda às expectativas.'),
};

const withDescription: IWorkExperience = {
  role: 'Auxiliar Administrativo',
  companyName: 'Loja Comac',
  startDate: '2023-01-01',
  endDate: '2025-02-01',
  technologies: [],
  description: richText('Consultas e alterações em banco de dados.'),
};

const withTechsOnly: IWorkExperience = {
  role: 'Freelancer',
  companyName: 'Cliente X',
  startDate: '2022-06-01',
  endDate: '2022-12-01',
  technologies: [{ name: 'Figma' }],
  description: null,
};

const bare: IWorkExperience = {
  role: 'Estágio em TI',
  companyName: 'IAT',
  startDate: '2022-01-01',
  endDate: '2023-01-01',
  technologies: [],
  description: null,
};

const renderExperience = (experiences = [current, withDescription, bare]) =>
  render(
    <LanguageProvider>
      <WorkExperience experiences={experiences} />
    </LanguageProvider>
  );

describe('WorkExperience', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('portfolio-gazolla:locale', 'pt-BR');
  });

  it('is the #experience section with title and subtitle', () => {
    const { container } = renderExperience();
    expect(container.querySelector('section#experience')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Experiência' })).toBeInTheDocument();
    expect(screen.getByText(/^Do suporte de TI à qualidade de software/)).toBeInTheDocument();
  });

  describe('current experience', () => {
    it('shows period, duration, role, company link, description and badges', () => {
      renderExperience([current]);
      expect(screen.getByText(/fev\.? 2025 – atual/)).toBeInTheDocument();
      expect(screen.getByText(/\d+ anos?/)).toBeInTheDocument();
      expect(screen.getByText('Analista de Testes')).toBeInTheDocument();
      const link = screen.getByRole('link', { name: /DB1 Global Software/ });
      expect(link).toHaveAttribute('href', 'https://www.db1.com.br');
      expect(screen.getByText('Garanto que o software atenda às expectativas.')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Postman')).toBeInTheDocument();
    });

    it('has an aria-hidden pulsing dot and no expand button', () => {
      const { container } = renderExperience([current]);
      expect(container.querySelector('[data-pulse-dot]')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  describe('previous experiences', () => {
    it('show role, company and period on one line with a collapsed "+" button', () => {
      renderExperience();
      expect(screen.getByText('Auxiliar Administrativo')).toBeInTheDocument();
      expect(screen.getByText('Loja Comac')).toBeInTheDocument();
      expect(screen.getAllByText(/jan\.? 2023 – fev\.? 2025/).length).toBeGreaterThan(0);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles aria-expanded with a click', async () => {
      const user = userEvent.setup();
      renderExperience();
      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles with Enter and Space', async () => {
      const user = userEvent.setup();
      renderExperience();
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('controls a region holding the description', () => {
      renderExperience();
      const button = screen.getByRole('button');
      const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
      expect(panel).toHaveTextContent('Consultas e alterações em banco de dados.');
    });

    it('has a "+" when there are only technologies', () => {
      renderExperience([current, withTechsOnly]);
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('has no "+" without description and without technologies', () => {
      renderExperience([current, bare]);
      expect(screen.queryByRole('button')).toBeNull();
    });
  });
});
