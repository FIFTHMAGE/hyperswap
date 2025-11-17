/**
 * Object transformation utilities
 * @module utils/object
 */

/**
 * Map object values
 */
export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  fn: (value: T[keyof T], key: string) => R
): Record<keyof T, R> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value as T[keyof T], key)])
  ) as Record<keyof T, R>;
}

/**
 * Filter object by predicate
 */
export function filterObject<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: T[keyof T], key: string) => boolean
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(value as T[keyof T], key))
  ) as Partial<T>;
}

/**
 * Invert object keys and values
 */
export function invertObject<T extends Record<string, string | number>>(
  obj: T
): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [String(value), key]));
}

/**
 * Flatten nested object
 */
export function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value as Record<string, unknown>, newKey));
      } else {
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );
}

/**
 * Unflatten object with dot notation keys
 */
export function unflattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const keys = key.split('.');
    let current = result;

    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        current[k] = value;
      } else {
        current[k] = current[k] || {};
        current = current[k] as Record<string, unknown>;
      }
    });
  });

  return result;
}
