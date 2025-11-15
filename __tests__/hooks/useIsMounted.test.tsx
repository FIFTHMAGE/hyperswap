/**
 * useIsMounted hook tests
 */

import { renderHook } from '@testing-library/react';

import { useIsMounted } from '@/hooks/lifecycle/useIsMounted';

describe('useIsMounted', () => {
  test('returns mounted status function', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(typeof result.current).toBe('function');
  });

  test('returns true when mounted', () => {
    const { result } = renderHook(() => useIsMounted());
    const isMounted = result.current;
    expect(isMounted()).toBe(true);
  });

  test('returns false after unmount', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    const isMounted = result.current;

    unmount();
    expect(isMounted()).toBe(false);
  });
});
