/**
 * useThrottle hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useThrottle } from '../core/useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial value', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useThrottle('initial', 1000));

      expect(result.current).toBe('initial');
    });
  });

  describe('throttling behavior', () => {
    it('should update value immediately on first change', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      );

      rerender({ value: 'updated', delay: 1000 });

      expect(result.current).toBe('updated');
    });

    it('should throttle rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      );

      // First update goes through
      rerender({ value: 'first', delay: 1000 });
      expect(result.current).toBe('first');

      // Second update is throttled
      act(() => {
        vi.advanceTimersByTime(500);
      });
      rerender({ value: 'second', delay: 1000 });
      expect(result.current).toBe('first');

      // After delay, value should update
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current).toBe('second');
    });

    it('should update to latest value after throttle period', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      );

      rerender({ value: 'first', delay: 1000 });
      rerender({ value: 'second', delay: 1000 });
      rerender({ value: 'third', delay: 1000 });
      rerender({ value: 'fourth', delay: 1000 });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current).toBe('fourth');
    });
  });

  describe('different delay values', () => {
    it('should respect different delay values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      rerender({ value: 'first', delay: 500 });

      act(() => {
        vi.advanceTimersByTime(250);
      });
      rerender({ value: 'second', delay: 500 });
      expect(result.current).toBe('first');

      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(result.current).toBe('second');
    });

    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      rerender({ value: 'first', delay: 0 });
      expect(result.current).toBe('first');

      rerender({ value: 'second', delay: 0 });
      expect(result.current).toBe('second');
    });
  });

  describe('complex values', () => {
    it('should handle object values', () => {
      const initial = { count: 0 };
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: initial, delay: 1000 } }
      );

      expect(result.current).toEqual({ count: 0 });

      rerender({ value: { count: 1 }, delay: 1000 });
      expect(result.current).toEqual({ count: 1 });
    });

    it('should handle array values', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: [1, 2], delay: 1000 } }
      );

      expect(result.current).toEqual([1, 2]);

      rerender({ value: [3, 4], delay: 1000 });
      expect(result.current).toEqual([3, 4]);
    });
  });

  describe('cleanup', () => {
    it('should clean up timeout on unmount', () => {
      const { result, rerender, unmount } = renderHook(
        ({ value, delay }) => useThrottle(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      );

      rerender({ value: 'first', delay: 1000 });
      rerender({ value: 'second', delay: 1000 });

      unmount();

      // Should not throw even after unmount
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    });
  });
});

