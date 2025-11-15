/**
 * useLocalStorage hook tests
 */

import { renderHook, act } from '@testing-library/react';

import { useLocalStorage } from '@/hooks/core/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  test('updates value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  test('persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('persisted');
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('persisted'));
  });

  test('reads from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('existing');
  });
});
