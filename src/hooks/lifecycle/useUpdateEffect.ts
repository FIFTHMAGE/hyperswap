/**
 * useUpdateEffect hook - useEffect that skips initial render
 * @module hooks/lifecycle
 */

import { useEffect, useRef } from 'react';

export function useUpdateEffect(effect: () => void | (() => void), deps: unknown[]): void {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
