/**
 * useMount hook - Run effect on mount only
 * @module hooks/lifecycle
 */

import { useEffect } from 'react';

export function useMount(fn: () => void): void {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
