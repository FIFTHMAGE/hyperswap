/**
 * Debounce and throttle utilities
 */

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function debounced(...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, waitMs);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function throttled(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

export function debounceAsync<T extends (...args: Parameters<T>) => Promise<ReturnType<T>>>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: Awaited<ReturnType<T>>) => void) | null = null;
  let latestReject: ((error: Error) => void) | null = null;
  
  return function debouncedAsync(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      latestResolve = resolve;
      latestReject = reject;
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          latestResolve?.(result as Awaited<ReturnType<T>>);
        } catch (error) {
          latestReject?.(error instanceof Error ? error : new Error(String(error)));
        } finally {
          timeoutId = null;
        }
      }, waitMs);
    });
  };
}

