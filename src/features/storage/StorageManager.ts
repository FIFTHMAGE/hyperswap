/**
 * StorageManager - Local storage management
 * @module features/storage
 */

export enum StorageKey {
  WALLET_ADDRESS = 'wallet_address',
  WALLET_TYPE = 'wallet_type',
  THEME = 'theme',
  SLIPPAGE = 'slippage',
  DEADLINE = 'deadline',
  RECENT_TRANSACTIONS = 'recent_transactions',
  FAVORITE_TOKENS = 'favorite_tokens',
  SETTINGS = 'settings',
  TOKEN_LISTS = 'token_lists',
}

export class StorageManager {
  private prefix: string;

  constructor(prefix: string = 'hyperswap_') {
    this.prefix = prefix;
  }

  /**
   * Get item from storage
   */
  get<T>(key: StorageKey): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
    }
  }

  /**
   * Clear all items with prefix
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Check if key exists
   */
  has(key: StorageKey): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Get full storage key
   */
  private getKey(key: StorageKey): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    } catch (error) {
      console.error('Error getting storage keys:', error);
    }
    return keys;
  }

  /**
   * Get storage size in bytes
   */
  getSize(): number {
    let size = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            size += key.length + value.length;
          }
        }
      });
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    return size;
  }

  /**
   * Export all data
   */
  export(): Record<string, any> {
    const data: Record<string, any> = {};
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              data[key.replace(this.prefix, '')] = JSON.parse(value);
            } catch {
              data[key.replace(this.prefix, '')] = value;
            }
          }
        }
      });
    } catch (error) {
      console.error('Error exporting storage:', error);
    }
    return data;
  }

  /**
   * Import data
   */
  import(data: Record<string, any>): void {
    try {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(
          this.getKey(key as StorageKey),
          typeof value === 'string' ? value : JSON.stringify(value)
        );
      });
    } catch (error) {
      console.error('Error importing storage:', error);
    }
  }
}

export const storageManager = new StorageManager();
