/**
 * Object merge utilities
 * @module utils/object
 */

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];

      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key as keyof T] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[keyof T];
      } else {
        output[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  }

  return output;
}

/**
 * Check if value is an object
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Shallow merge multiple objects
 */
export function merge<T extends Record<string, unknown>>(...objects: Partial<T>[]): T {
  return Object.assign({}, ...objects) as T;
}

/**
 * Merge with array concatenation
 */
export function mergeConcat<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      output[key as keyof T] = [...targetValue, ...sourceValue] as T[keyof T];
    } else if (isObject(sourceValue) && isObject(targetValue)) {
      output[key as keyof T] = mergeConcat(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else {
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return output;
}
