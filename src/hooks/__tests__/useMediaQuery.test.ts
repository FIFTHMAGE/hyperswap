/**
 * useMediaQuery hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from '../core/useMediaQuery';

describe('useMediaQuery', () => {
  type MediaQueryListener = (event: { matches: boolean }) => void;
  
  let mockAddListener: ReturnType<typeof vi.fn>;
  let mockRemoveListener: ReturnType<typeof vi.fn>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let listeners: MediaQueryListener[];

  beforeEach(() => {
    listeners = [];
    mockAddListener = vi.fn((listener: MediaQueryListener) => {
      listeners.push(listener);
    });
    mockRemoveListener = vi.fn((listener: MediaQueryListener) => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    });

    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: mockAddListener,
      removeEventListener: mockRemoveListener,
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    listeners = [];
  });

  describe('initial state', () => {
    it('should return true when query matches', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(true);
    });

    it('should return false when query does not match', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(false);
    });
  });

  describe('query changes', () => {
    it('should update when query changes', () => {
      const { result, rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(min-width: 768px)' } }
      );

      expect(result.current).toBe(true);

      rerender({ query: '(min-width: 1024px)' });

      expect(result.current).toBe(false);
    });
  });

  describe('event handling', () => {
    it('should add event listener on mount', () => {
      renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(mockAddListener).toHaveBeenCalled();
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      unmount();

      expect(mockRemoveListener).toHaveBeenCalled();
    });

    it('should update when media query changes', () => {
      mockMatchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: mockAddListener,
        removeEventListener: mockRemoveListener,
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      // Simulate media query change
      act(() => {
        listeners.forEach((listener) => listener({ matches: true }));
      });

      expect(result.current).toBe(true);
    });
  });

  describe('SSR compatibility', () => {
    it('should handle undefined window.matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-expect-error - Testing undefined case
      delete window.matchMedia;

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('common breakpoints', () => {
    it('should work with mobile breakpoint', () => {
      mockMatchMedia = vi.fn(() => ({
        matches: true,
        media: '(max-width: 640px)',
        onchange: null,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: mockAddListener,
        removeEventListener: mockRemoveListener,
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() => useMediaQuery('(max-width: 640px)'));

      expect(result.current).toBe(true);
    });

    it('should work with dark mode query', () => {
      mockMatchMedia = vi.fn(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: mockAddListener,
        removeEventListener: mockRemoveListener,
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-color-scheme: dark)')
      );

      expect(result.current).toBe(true);
    });
  });
});

