/**
 * Factory for creating async data fetching hooks
 * @module hooks/factories/createAsyncHook
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Async hook state
 */
export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Async hook options
 */
export interface AsyncHookOptions {
  /**
   * Auto-fetch on mount
   */
  immediate?: boolean;

  /**
   * Dependencies to trigger refetch
   */
  deps?: readonly unknown[];

  /**
   * Success callback
   */
  onSuccess?: (data: unknown) => void;

  /**
   * Error callback
   */
  onError?: (error: Error) => void;

  /**
   * Enable/disable the hook
   */
  enabled?: boolean;
}

/**
 * Create an async data fetching hook
 *
 * @example
 * ```ts
 * const useUserData = createAsyncHook(
 *   (userId: string) => api.getUser(userId)
 * );
 *
 * // Usage
 * const { data, loading, error, refetch } = useUserData('123');
 * ```
 */
export function createAsyncHook<T, Args extends unknown[]>(fetchFn: (...args: Args) => Promise<T>) {
  return function useAsync(...args: [...Args, AsyncHookOptions?]): AsyncState<T> {
    const options = (args[args.length - 1] as AsyncHookOptions) || {};
    const fetchArgs = args.slice(0, -1) as Args;

    const { immediate = true, deps = [], onSuccess, onError, enabled = true } = options;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const execute = useCallback(async () => {
      if (!enabled) return;

      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(...fetchArgs);
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    }, [enabled, ...fetchArgs, ...deps]);

    useEffect(() => {
      if (immediate) {
        execute();
      }
    }, [immediate, execute]);

    return {
      data,
      error,
      loading,
      refetch: execute,
    };
  };
}

/**
 * Create a mutation hook (async action without auto-fetch)
 *
 * @example
 * ```ts
 * const useCreateUser = createMutationHook(
 *   (userData: UserData) => api.createUser(userData)
 * );
 *
 * // Usage
 * const { mutate, loading, error } = useCreateUser();
 * await mutate({ name: 'John' });
 * ```
 */
export function createMutationHook<T, Args extends unknown[]>(
  mutateFn: (...args: Args) => Promise<T>
) {
  return function useMutation() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const mutate = useCallback(
      async (...args: Args): Promise<T> => {
        try {
          setLoading(true);
          setError(null);
          const result = await mutateFn(...args);
          setData(result);
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      [mutateFn]
    );

    const reset = useCallback(() => {
      setData(null);
      setError(null);
      setLoading(false);
    }, []);

    return {
      mutate,
      data,
      error,
      loading,
      reset,
    };
  };
}
