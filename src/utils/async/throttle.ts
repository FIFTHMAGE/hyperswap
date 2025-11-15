/**
 * Throttle utility function
 * @module utils/async
 */

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function throttledFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Throttle with trailing edge execution
 */
export function throttleTrailing<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan = 0;

  return function throttledFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (lastFunc) {
      clearTimeout(lastFunc);
    }

    if (now - lastRan >= limit) {
      func(...args);
      lastRan = now;
    } else {
      lastFunc = setTimeout(
        () => {
          func(...args);
          lastRan = Date.now();
        },
        limit - (now - lastRan)
      );
    }
  };
}
