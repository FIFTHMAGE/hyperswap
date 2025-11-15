/**
 * useEffectOnce hook tests
 */

import { renderHook } from '@testing-library/react';

import { useEffectOnce } from '@/hooks/lifecycle/useEffectOnce';

describe('useEffectOnce', () => {
  test('runs effect only once', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(() => useEffectOnce(effect));

    expect(effect).toHaveBeenCalledTimes(1);

    rerender();
    rerender();
    rerender();

    expect(effect).toHaveBeenCalledTimes(1);
  });

  test('runs cleanup on unmount', () => {
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);

    const { unmount } = renderHook(() => useEffectOnce(effect));

    unmount();

    expect(cleanup).toHaveBeenCalled();
  });
});
