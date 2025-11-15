/**
 * Shared component hooks
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Hook for managing component mounted state
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

// Hook for handling async operations in components
export function useAsyncAction<T extends (...args: Parameters<T>) => Promise<ReturnType<T>>>(
  action: T
): [(...args: Parameters<T>) => Promise<void>, boolean, Error | null] {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useIsMounted();

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        await action(...args);
      } catch (err) {
        if (isMounted()) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    },
    [action, isMounted]
  );

  return [execute, isLoading, error];
}

// Hook for tracking component visibility
export function useComponentVisible(
  initialIsVisible: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [isVisible, setIsVisible] = useState(initialIsVisible);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible(prev => !prev), []);

  return [isVisible, show, hide, toggle];
}

