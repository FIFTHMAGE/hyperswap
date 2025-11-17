/**
 * Browser storage utilities
 * @module utils/browser
 */

export const storage = {
  local: {
    get<T>(key: string): T | null {
      if (typeof window === 'undefined') return null;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },

    set<T>(key: string, value: T): void {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },

    remove(key: string): void {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    },

    clear(): void {
      if (typeof window === 'undefined') return;
      localStorage.clear();
    },
  },

  session: {
    get<T>(key: string): T | null {
      if (typeof window === 'undefined') return null;
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },

    set<T>(key: string, value: T): void {
      if (typeof window === 'undefined') return;
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save to sessionStorage:', error);
      }
    },

    remove(key: string): void {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(key);
    },

    clear(): void {
      if (typeof window === 'undefined') return;
      sessionStorage.clear();
    },
  },
};
