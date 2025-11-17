/**
 * Array filtering utilities
 * @module utils/array
 */

/**
 * Filter array by multiple criteria
 */
export function multiFilter<T>(array: T[], filters: Partial<Record<keyof T, unknown>>): T[] {
  return array.filter((item) =>
    Object.entries(filters).every(([key, value]) => item[key as keyof T] === value)
  );
}

/**
 * Filter array with fuzzy search
 */
export function fuzzyFilter<T>(array: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  const lowerSearch = searchTerm.toLowerCase();

  return array.filter((item) =>
    keys.some((key) => {
      const value = String(item[key]).toLowerCase();
      return value.includes(lowerSearch);
    })
  );
}

/**
 * Filter unique items by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Partition array into two based on predicate
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  array.forEach((item) => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });

  return [pass, fail];
}
