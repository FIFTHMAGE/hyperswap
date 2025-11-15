/**
 * Generic hook for real-time subscriptions
 */

import { useState, useEffect } from 'react';
import { realtimeEvents } from '@/lib/realtime/event-emitter';

export function useRealtimeSubscription<T>(
  event: string,
  initialValue: T
): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const unsubscribe = realtimeEvents.on(event, (data: T) => {
      setValue(data);
    });

    return unsubscribe as () => void;
  }, [event]);

  return value;
}

