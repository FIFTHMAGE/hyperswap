/**
 * useUnmount hook - Run cleanup on unmount
 * @module hooks/lifecycle
 */

import { useEffect, useRef } from 'react';

export function useUnmount(fn: () => void): void {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
