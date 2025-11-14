/**
 * LocalStorage wrapper with type safety and error handling
 * @module utils/browser/storage
 */

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set item in localStorage with JSON serialization
 */
export function setItem<T>(key: string, value: T): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Get item from localStorage with JSON deserialization
 */
export function getItem<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clear(): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get all keys from localStorage
 */
export function getAllKeys(): string[] {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  return localStorage.getItem(key) !== null;
}

/**
 * Get item with default value
 */
export function getItemOrDefault<T>(key: string, defaultValue: T): T {
  const item = getItem<T>(key);
  return item !== null ? item : defaultValue;
}

/**
 * Set item with expiration
 */
export function setItemWithExpiry<T>(
  key: string,
  value: T,
  expiryMs: number
): boolean {
  const item = {
    value,
    expiry: Date.now() + expiryMs,
  };
  
  return setItem(key, item);
}

/**
 * Get item with expiration check
 */
export function getItemWithExpiry<T>(key: string): T | null {
  const item = getItem<{ value: T; expiry: number }>(key);
  
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    removeItem(key);
    return null;
  }
  
  return item.value;
}

