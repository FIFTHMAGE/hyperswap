/**
 * Factory for creating storage-backed hooks
 * @module hooks/factories/createStorageHook
 */

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Browser localStorage adapter
 */
export const localStorageAdapter: StorageAdapter = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

/**
 * Browser sessionStorage adapter
 */
export const sessionStorageAdapter: StorageAdapter = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};

/**
 * Create a storage-backed state hook
 *
 * @example
 * ```ts
 * const useTheme = createStorageHook<'light' | 'dark'>('app-theme', 'light');
 *
 * // Usage
 * const [theme, setTheme, removeTheme] = useTheme();
 * ```
 */
export function createStorageHook<T>(
  key: string,
  initialValue: T,
  storage: StorageAdapter = localStorageAdapter
) {
  return function useStorage(): [T, Dispatch<SetStateAction<T>>, () => void] {
    // Initialize state from storage or use initial value
    const [value, setValue] = useState<T>(() => {
      try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn(`Error reading from storage for key "${key}":`, error);
        return initialValue;
      }
    });

    // Update storage when value changes
    useEffect(() => {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error writing to storage for key "${key}":`, error);
      }
    }, [key, value]);

    // Remove from storage
    const remove = useCallback(() => {
      try {
        storage.removeItem(key);
        setValue(initialValue);
      } catch (error) {
        console.warn(`Error removing from storage for key "${key}":`, error);
      }
    }, [key]);

    return [value, setValue, remove];
  };
}

/**
 * Create a localStorage hook
 *
 * @example
 * ```ts
 * const useUserPreferences = createLocalStorageHook<Preferences>(
 *   'user-preferences',
 *   defaultPreferences
 * );
 * ```
 */
export function createLocalStorageHook<T>(key: string, initialValue: T) {
  return createStorageHook(key, initialValue, localStorageAdapter);
}

/**
 * Create a sessionStorage hook
 *
 * @example
 * ```ts
 * const useSearchQuery = createSessionStorageHook<string>(
 *   'search-query',
 *   ''
 * );
 * ```
 */
export function createSessionStorageHook<T>(key: string, initialValue: T) {
  return createStorageHook(key, initialValue, sessionStorageAdapter);
}
