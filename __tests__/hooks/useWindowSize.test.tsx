/**
 * useWindowSize hook tests
 */

import { renderHook, act } from '@testing-library/react';

import { useWindowSize } from '@/hooks/core/useWindowSize';

describe('useWindowSize', () => {
  test('returns initial window size', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toHaveProperty('width');
    expect(result.current).toHaveProperty('height');
  });

  test('updates on window resize', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });
});
