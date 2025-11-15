/**
 * Throttle hook
 * @module hooks/core
 */

import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(0);

  const throttled = useCallback(
    (...args: unknown[]) => {
      const now = Date.now();

      if (lastRan.current === 0 || now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    },
    [callback, delay]
  );

  return throttled as T;
}
