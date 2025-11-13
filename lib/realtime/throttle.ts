/**
 * Throttling utilities for real-time data
 */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall < delay) {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    } else {
      lastCall = now;
      func(...args);
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function rateLimit<T extends (...args: any[]) => any>(
  func: T,
  maxCalls: number,
  timeWindow: number
): (...args: Parameters<T>) => boolean {
  const calls: number[] = [];

  return (...args: Parameters<T>): boolean => {
    const now = Date.now();
    
    // Remove old calls outside time window
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }

    if (calls.length < maxCalls) {
      calls.push(now);
      func(...args);
      return true;
    }

    return false;
  };
}

