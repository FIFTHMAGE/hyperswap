/**
 * Throttle implementation
 * @module utils/async/throttle
 */

/**
 * Throttle a function - ensures it's called at most once per specified time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  const { leading = true, trailing = true } = options;
  
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime: number | null = null;

  const invokeFunc = (args: Parameters<T>) => {
    lastCallTime = Date.now();
    func(...args);
  };

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    
    // First call
    if (lastCallTime === null) {
      if (leading) {
        invokeFunc(args);
      } else {
        lastCallTime = now;
      }
      return;
    }

    const timeSinceLastCall = now - lastCallTime;
    const timeUntilNextCall = wait - timeSinceLastCall;

    lastArgs = args;

    if (timeUntilNextCall <= 0) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      invokeFunc(args);
      lastArgs = null;
    } else if (trailing && timeoutId === null) {
      timeoutId = setTimeout(() => {
        if (lastArgs !== null) {
          invokeFunc(lastArgs);
          lastArgs = null;
        }
        timeoutId = null;
      }, timeUntilNextCall);
    }
  };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = null;
    lastArgs = null;
  };

  return throttled;
}

/**
 * Throttle with promise support
 */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let lastCallTime: number | null = null;
  let pendingPromise: Promise<ReturnType<T>> | null = null;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= wait) {
      lastCallTime = now;
      pendingPromise = func(...args);
      return pendingPromise;
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    // This shouldn't happen, but TypeScript requires handling
    lastCallTime = now;
    pendingPromise = func(...args);
    return pendingPromise;
  };
}

