/// <reference types="@testing-library/jest-dom" />
import { render } from '@testing-library/react';
import { MainImage } from '../../app/componentes/pages/project/project-details/main-image';

const mockReduced = jest.fn();
jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react');
  return { ...actual, useReducedMotion: () => mockReduced() };
});

describe('MainImage', () => {
  it('renders without a transform style under reduced motion', () => {
    mockReduced.mockReturnValue(true);
    const { container } = render(<MainImage src="https://example.com/a.png" alt="x" />);
    const drifting = container.querySelector('div > div') as HTMLElement;
    expect(drifting.style.transform).toBe('');
  });
});
