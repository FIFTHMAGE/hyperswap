/**
 * Memoization utilities for performance optimization
 * @module utils/performance/memoize
 */

/**
 * Memoize function with single argument
 */
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();

  return (arg: T): R => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

/**
 * Memoize function with custom key resolver
 */
export function memoizeWith<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyResolver: (...args: T) => string
): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = keyResolver(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Memoize with LRU cache
 */
export function memoizeLRU<T extends unknown[], R>(
  fn: (...args: T) => R,
  maxSize: number = 100
): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key)!;
      // Move to end (most recently used)
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn(...args);

    // Remove oldest if at capacity
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

/**
 * Memoize with TTL (time to live)
 */
export function memoizeTTL<T extends unknown[], R>(
  fn: (...args: T) => R,
  ttl: number = 60000
): (...args: T) => R {
  const cache = new Map<string, { value: R; timestamp: number }>();

  return (...args: T): R => {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const cached = cache.get(key)!;
      if (now - cached.timestamp < ttl) {
        return cached.value;
      }
      cache.delete(key);
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}
