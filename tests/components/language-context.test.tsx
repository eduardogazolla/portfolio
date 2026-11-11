import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  LanguageProvider,
  useLanguage,
} from '../../app/componentes/context/language-context';

const STORAGE_KEY = 'portfolio-gazolla:locale';

const LocaleConsumer = () => {
  const { locale, toggleLocale } = useLanguage();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button type="button" onClick={toggleLocale}>
        toggle
      </button>
    </div>
  );
};

const renderConsumer = () =>
  render(
    <LanguageProvider>
      <LocaleConsumer />
    </LanguageProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('LanguageProvider', () => {
  it('renders the locale stored in localStorage after mount', () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    renderConsumer();
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });

  it('persists the toggled locale under the storage key', () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    renderConsumer();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByTestId('locale')).toHaveTextContent('pt-BR');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt-BR');
  });

  // Keep this case last: when storage throws, the locale is held in module
  // memory for the rest of the test file.
  it('does not crash and still toggles when localStorage throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage denied');
    });

    expect(() => renderConsumer()).not.toThrow();
    const initial = screen.getByTestId('locale').textContent;
    expect(['pt-BR', 'en']).toContain(initial);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    });

    const expected = initial === 'pt-BR' ? 'en' : 'pt-BR';
    expect(screen.getByTestId('locale')).toHaveTextContent(expected);
  });
});
