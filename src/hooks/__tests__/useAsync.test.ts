/**
 * useAsync hook tests
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAsync } from '../core/useAsync';

describe('useAsync', () => {
  describe('initial state', () => {
    it('should start with idle status', () => {
      const asyncFn = vi.fn();
      const { result } = renderHook(() => useAsync(asyncFn));

      expect(result.current.status).toBe('idle');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('execute', () => {
    it('should execute async function and return data', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success data');
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe('success data');
      expect(asyncFn).toHaveBeenCalled();
    });

    it('should set loading state during execution', async () => {
      let resolvePromise: (value: string) => void;
      const asyncFn = vi.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useAsync(asyncFn));

      act(() => {
        result.current.execute();
      });

      expect(result.current.status).toBe('loading');
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!('data');
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      const asyncFn = vi.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        try {
          await result.current.execute();
        } catch {
          // Expected error
        }
      });

      expect(result.current.status).toBe('error');
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(error);
    });

    it('should pass arguments to async function', async () => {
      const asyncFn = vi.fn((a: number, b: string) =>
        Promise.resolve({ a, b })
      );
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute(42, 'test');
      });

      expect(asyncFn).toHaveBeenCalledWith(42, 'test');
      expect(result.current.data).toEqual({ a: 42, b: 'test' });
    });
  });

  describe('immediate execution', () => {
    it('should execute immediately when immediate is true', async () => {
      const asyncFn = vi.fn().mockResolvedValue('immediate data');
      renderHook(() => useAsync(asyncFn, { immediate: true }));

      await waitFor(() => {
        expect(asyncFn).toHaveBeenCalled();
      });
    });

    it('should not execute immediately when immediate is false', () => {
      const asyncFn = vi.fn().mockResolvedValue('data');
      renderHook(() => useAsync(asyncFn, { immediate: false }));

      expect(asyncFn).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset state to idle', async () => {
      const asyncFn = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const asyncFn = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsync(asyncFn, { onSuccess }));

      await act(async () => {
        await result.current.execute();
      });

      expect(onSuccess).toHaveBeenCalledWith('data');
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      const error = new Error('Test error');
      const asyncFn = vi.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAsync(asyncFn, { onError }));

      await act(async () => {
        try {
          await result.current.execute();
        } catch {
          // Expected
        }
      });

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('concurrent executions', () => {
    it('should handle concurrent calls correctly', async () => {
      let callCount = 0;
      const asyncFn = vi.fn(() => {
        const count = ++callCount;
        return new Promise((resolve) =>
          setTimeout(() => resolve(`result-${count}`), count * 50)
        );
      });

      const { result } = renderHook(() => useAsync(asyncFn));

      // Start two concurrent executions
      await act(async () => {
        result.current.execute();
        result.current.execute();
        // Wait for both to complete
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      // Last execution should be the final result
      expect(result.current.data).toBe('result-2');
    });
  });

  describe('cleanup', () => {
    it('should not update state after unmount', async () => {
      let resolvePromise: (value: string) => void;
      const asyncFn = vi.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result, unmount } = renderHook(() => useAsync(asyncFn));

      act(() => {
        result.current.execute();
      });

      unmount();

      // This should not cause issues
      await act(async () => {
        resolvePromise!('data');
      });

      // No assertion needed - test passes if no error is thrown
    });
  });
});

