/**
 * Debounce utility function
 * @module utils/async
 */

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debouncedFunction(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Debounce with leading edge execution
 */
export function debounceLeading<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  return function debouncedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    if (now - lastCallTime >= wait) {
      func(...args);
      lastCallTime = now;
    } else {
      timeoutId = setTimeout(() => {
        func(...args);
        lastCallTime = Date.now();
      }, wait);
    }
  };
}
