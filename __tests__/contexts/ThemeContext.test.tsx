/**
 * ThemeContext tests
 */

import { render, screen, act } from '@testing-library/react';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function TestComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved">{resolvedTheme}</div>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides theme context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toBeInTheDocument();
    expect(screen.getByTestId('resolved')).toBeInTheDocument();
  });

  test('allows theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Dark').click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => render(<TestComponent />)).toThrow();

    consoleError.mockRestore();
  });
});
