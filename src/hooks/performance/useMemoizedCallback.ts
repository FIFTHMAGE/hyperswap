/**
 * Optimized callback memoization hooks
 */

import { useCallback, useRef, useEffect } from 'react';

export function useEventCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T
): T {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => ref.current(...args)) as T,
    []
  );
}

export function useStableCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T | undefined
): T | undefined {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current?.(...args)) as T,
    []
  );
}

