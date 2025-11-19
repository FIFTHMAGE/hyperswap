/**
 * Factory for creating state management hooks
 * @module hooks/factories/createStateHook
 */

import { useState, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * State hook with additional utilities
 */
export interface StateHook<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  reset: () => void;
  toggle: () => void; // Only available for boolean types
}

/**
 * Create a state hook with reset functionality
 *
 * @example
 * ```ts
 * const useCounter = createStateHook(0);
 *
 * // Usage
 * const { value, setValue, reset } = useCounter();
 * ```
 */
export function createStateHook<T>(initialValue: T) {
  return function useState(): Omit<StateHook<T>, 'toggle'> {
    const [value, setValue] = useState<T>(initialValue);

    const reset = useCallback(() => {
      setValue(initialValue);
    }, [initialValue]);

    return {
      value,
      setValue,
      reset,
    };
  };
}

/**
 * Create a boolean toggle hook
 *
 * @example
 * ```ts
 * const useModalOpen = createToggleHook(false);
 *
 * // Usage
 * const { value, toggle, setValue } = useModalOpen();
 * ```
 */
export function createToggleHook(initialValue = false) {
  return function useToggle() {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
      setValue((prev) => !prev);
    }, []);

    const reset = useCallback(() => {
      setValue(initialValue);
    }, [initialValue]);

    return {
      value,
      setValue,
      toggle,
      reset,
    };
  };
}

/**
 * Create a counter hook
 *
 * @example
 * ```ts
 * const usePageCounter = createCounterHook(1);
 *
 * // Usage
 * const { value, increment, decrement, reset } = usePageCounter();
 * ```
 */
export function createCounterHook(initialValue = 0) {
  return function useCounter() {
    const [value, setValue] = useState(initialValue);

    const increment = useCallback((by = 1) => {
      setValue((prev) => prev + by);
    }, []);

    const decrement = useCallback((by = 1) => {
      setValue((prev) => prev - by);
    }, []);

    const reset = useCallback(() => {
      setValue(initialValue);
    }, [initialValue]);

    return {
      value,
      setValue,
      increment,
      decrement,
      reset,
    };
  };
}

/**
 * Create an array state hook with utility methods
 *
 * @example
 * ```ts
 * const useSelectedTokens = createArrayHook<string>([]);
 *
 * // Usage
 * const { value, push, remove, clear } = useSelectedTokens();
 * ```
 */
export function createArrayHook<T>(initialValue: T[] = []) {
  return function useArray() {
    const [value, setValue] = useState<T[]>(initialValue);

    const push = useCallback((item: T) => {
      setValue((prev) => [...prev, item]);
    }, []);

    const remove = useCallback((index: number) => {
      setValue((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const removeItem = useCallback((item: T) => {
      setValue((prev) => prev.filter((i) => i !== item));
    }, []);

    const clear = useCallback(() => {
      setValue([]);
    }, []);

    const reset = useCallback(() => {
      setValue(initialValue);
    }, [initialValue]);

    const update = useCallback((index: number, newItem: T) => {
      setValue((prev) => prev.map((item, i) => (i === index ? newItem : item)));
    }, []);

    return {
      value,
      setValue,
      push,
      remove,
      removeItem,
      clear,
      reset,
      update,
    };
  };
}

/**
 * Create a map state hook with utility methods
 *
 * @example
 * ```ts
 * const useTokenPrices = createMapHook<string, number>();
 *
 * // Usage
 * const { value, set, remove, clear } = useTokenPrices();
 * ```
 */
export function createMapHook<K, V>(initialValue: Map<K, V> = new Map()) {
  return function useMap() {
    const [value, setValue] = useState<Map<K, V>>(new Map(initialValue));

    const set = useCallback((key: K, val: V) => {
      setValue((prev) => new Map(prev).set(key, val));
    }, []);

    const remove = useCallback((key: K) => {
      setValue((prev) => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
    }, []);

    const clear = useCallback(() => {
      setValue(new Map());
    }, []);

    const reset = useCallback(() => {
      setValue(new Map(initialValue));
    }, [initialValue]);

    return {
      value,
      setValue,
      set,
      remove,
      clear,
      reset,
    };
  };
}
