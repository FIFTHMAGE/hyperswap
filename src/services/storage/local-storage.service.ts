/**
 * Enhanced local storage service with type safety
 * @module services/storage
 */

class LocalStorageService {
  /**
   * Get item from localStorage
   */
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  /**
   * Clear all items
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    if (typeof window === 'undefined') return [];
    return Object.keys(localStorage);
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) !== null;
  }
}

export const localStorageService = new LocalStorageService();
