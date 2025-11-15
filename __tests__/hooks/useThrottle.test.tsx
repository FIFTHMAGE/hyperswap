/**
 * useThrottle hook tests
 */

import { renderHook } from '@testing-library/react';

import { useThrottle } from '@/hooks/core/useThrottle';

describe('useThrottle', () => {
  jest.useFakeTimers();

  test('throttles function calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    result.current();
    result.current();
    result.current();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('allows call after delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    result.current();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    result.current();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
