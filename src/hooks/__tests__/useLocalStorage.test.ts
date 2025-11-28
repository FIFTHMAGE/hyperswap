/**
 * useLocalStorage hook tests
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocalStorage } from '../core/useLocalStorage';

describe('useLocalStorage', () => {
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      expect(result.current[0]).toBe('initial');
    });

    it('should return stored value when localStorage has data', () => {
      mockLocalStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle complex objects', () => {
      const initialValue = { name: 'test', count: 42 };
      const { result } = renderHook(() =>
        useLocalStorage('test-key', initialValue)
      );

      expect(result.current[0]).toEqual(initialValue);
    });

    it('should handle arrays', () => {
      const initialValue = [1, 2, 3, 'test'];
      const { result } = renderHook(() =>
        useLocalStorage('test-key', initialValue)
      );

      expect(result.current[0]).toEqual(initialValue);
    });
  });

  describe('setValue', () => {
    it('should update state and localStorage', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('updated')
      );
    });

    it('should support function updater', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 10));

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
    });

    it('should handle null value', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | null>('test-key', 'initial')
      );

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBeNull();
    });
  });

  describe('removeValue', () => {
    it('should remove value from localStorage', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[2]();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      mockLocalStorage.setItem('test-key', 'invalid-json{');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback')
      );

      expect(result.current[0]).toBe('fallback');
    });

    it('should handle localStorage access errors', () => {
      const errorMock = vi.spyOn(mockLocalStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback')
      );

      expect(result.current[0]).toBe('fallback');
      errorMock.mockRestore();
    });
  });

  describe('synchronization', () => {
    it('should update when storage event is fired', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        mockLocalStorage.setItem('test-key', JSON.stringify('external-update'));
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: JSON.stringify('external-update'),
          })
        );
      });

      expect(result.current[0]).toBe('external-update');
    });

    it('should ignore storage events for different keys', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'other-key',
            newValue: JSON.stringify('other-value'),
          })
        );
      });

      expect(result.current[0]).toBe('initial');
    });
  });
});

