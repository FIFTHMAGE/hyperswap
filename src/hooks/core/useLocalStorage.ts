/**
 * Local storage hook with TypeScript support
 * @module hooks/core/useLocalStorage
 */

import { useState, useEffect } from 'react';
import { getItem, setItem as saveItem, removeItem } from '@/utils/browser/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = getItem<T>(key);
    return stored !== null ? stored : initialValue;
  });

  useEffect(() => {
    saveItem(key, value);
  }, [key, value]);

  const remove = () => {
    removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove] as const;
}

