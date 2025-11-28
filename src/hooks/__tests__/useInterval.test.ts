/**
 * useInterval hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInterval } from '../core/useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should call callback at specified interval', () => {
      const callback = vi.fn();
      renderHook(() => useInterval(callback, 1000));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should call callback multiple times', () => {
      const callback = vi.fn();
      renderHook(() => useInterval(callback, 500));

      act(() => {
        vi.advanceTimersByTime(2500);
      });

      expect(callback).toHaveBeenCalledTimes(5);
    });
  });

  describe('null delay', () => {
    it('should not run interval when delay is null', () => {
      const callback = vi.fn();
      renderHook(() => useInterval(callback, null));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should pause interval when delay becomes null', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ delay }) => useInterval(callback, delay),
        { initialProps: { delay: 1000 as number | null } }
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(callback).toHaveBeenCalledTimes(2);

      rerender({ delay: null });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(callback).toHaveBeenCalledTimes(2); // Still 2
    });

    it('should resume interval when delay changes from null', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ delay }) => useInterval(callback, delay),
        { initialProps: { delay: null as number | null } }
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(callback).not.toHaveBeenCalled();

      rerender({ delay: 1000 });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe('delay changes', () => {
    it('should reset interval when delay changes', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ delay }) => useInterval(callback, delay),
        { initialProps: { delay: 1000 } }
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      rerender({ delay: 2000 });

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Interval was reset, so it hasn't fired yet
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('callback changes', () => {
    it('should use updated callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { rerender } = renderHook(
        ({ callback }) => useInterval(callback, 1000),
        { initialProps: { callback: callback1 } }
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      rerender({ callback: callback2 });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const callback = vi.fn();
      const { unmount } = renderHook(() => useInterval(callback, 1000));

      act(() => {
        vi.advanceTimersByTime(500);
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('immediate execution', () => {
    it('should execute immediately when immediate option is true', () => {
      const callback = vi.fn();
      renderHook(() => useInterval(callback, 1000, { immediate: true }));

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not execute immediately by default', () => {
      const callback = vi.fn();
      renderHook(() => useInterval(callback, 1000));

      expect(callback).not.toHaveBeenCalled();
    });
  });
});

