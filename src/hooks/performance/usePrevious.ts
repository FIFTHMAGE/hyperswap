/**
 * Hook to track previous value
 */

import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useCompare<T>(value: T): [T | undefined, boolean] {
  const previous = usePrevious(value);
  const hasChanged = previous !== value;
  return [previous, hasChanged];
}

