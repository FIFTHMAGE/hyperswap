/**
 * useDebounce hook tests
 */

import { renderHook, act } from '@testing-library/react';

import { useDebounce } from '@/hooks/core/useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  test('debounces value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  test('cancels previous debounce', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'third' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('third');
  });
});
