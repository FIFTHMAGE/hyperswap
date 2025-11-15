/**
 * Hook that runs effect only once
 * @module hooks/lifecycle
 */

import { useEffect, type EffectCallback } from 'react';

export function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
