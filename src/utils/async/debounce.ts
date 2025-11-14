/**
 * Debounce implementation
 * @module utils/async/debounce
 */

/**
 * Debounce a function - delays execution until after wait time has elapsed
 * since the last time it was invoked
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      if (lastArgs !== null) {
        func(...lastArgs);
        lastArgs = null;
      }
      timeoutId = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      if (lastArgs !== null) {
        func(...lastArgs);
      }
      timeoutId = null;
      lastArgs = null;
    }
  };

  return debounced;
}

/**
 * Debounce with promise support
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let resolveList: Array<(value: ReturnType<T>) => void> = [];
  let rejectList: Array<(reason: any) => void> = [];

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      resolveList.push(resolve);
      rejectList.push(reject);

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        const currentResolves = resolveList;
        const currentRejects = rejectList;
        resolveList = [];
        rejectList = [];
        timeoutId = null;

        try {
          const result = await func(...args);
          currentResolves.forEach(res => res(result));
        } catch (error) {
          currentRejects.forEach(rej => rej(error));
        }
      }, wait);
    });
  };
}

