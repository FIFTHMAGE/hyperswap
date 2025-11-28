/**
 * useCopyToClipboard hook tests
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyToClipboard } from '../core/useCopyToClipboard';

describe('useCopyToClipboard', () => {
  const mockClipboard = {
    writeText: vi.fn(),
    readText: vi.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should have null copied value initially', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      expect(result.current.copiedText).toBeNull();
      expect(result.current.isCopied).toBe(false);
    });
  });

  describe('copy function', () => {
    it('should copy text to clipboard', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
      expect(result.current.copiedText).toBe('test text');
      expect(result.current.isCopied).toBe(true);
    });

    it('should handle copy failure', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Copy failed'));
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('test text');
        expect(success).toBe(false);
      });

      expect(result.current.copiedText).toBeNull();
      expect(result.current.isCopied).toBe(false);
    });

    it('should return success status', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copy('test text');
      });

      expect(success).toBe(true);
    });
  });

  describe('reset after timeout', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should reset isCopied after timeout', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard({ timeout: 2000 }));

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(result.current.isCopied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('should use default timeout', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(result.current.isCopied).toBe(true);

      // Default timeout is usually 2000-3000ms
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('should reset timer on new copy', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard({ timeout: 2000 }));

      await act(async () => {
        await result.current.copy('first');
      });

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      await act(async () => {
        await result.current.copy('second');
      });

      expect(result.current.isCopied).toBe(true);
      expect(result.current.copiedText).toBe('second');

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Should still be copied because timer was reset
      expect(result.current.isCopied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isCopied).toBe(false);
    });
  });

  describe('reset function', () => {
    it('should reset copied state', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(result.current.isCopied).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isCopied).toBe(false);
      expect(result.current.copiedText).toBeNull();
    });
  });

  describe('callback', () => {
    it('should call onCopy callback on success', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined);
      const onCopy = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onCopy }));

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(onCopy).toHaveBeenCalledWith('test text');
    });

    it('should call onError callback on failure', async () => {
      const error = new Error('Copy failed');
      mockClipboard.writeText.mockRejectedValue(error);
      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      await act(async () => {
        await result.current.copy('test text');
      });

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('fallback for unsupported clipboard', () => {
    it('should handle missing clipboard API', async () => {
      const originalClipboard = navigator.clipboard;
      // @ts-expect-error - Testing undefined case
      delete navigator.clipboard;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('test text');
        expect(success).toBe(false);
      });

      Object.assign(navigator, { clipboard: originalClipboard });
    });
  });
});

