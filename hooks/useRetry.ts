'use client';

import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  const [attempts, setAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (): Promise<T> => {
    setIsRetrying(true);
    let currentAttempt = 0;

    while (currentAttempt < maxAttempts) {
      try {
        const result = await asyncFn();
        setAttempts(currentAttempt);
        setIsRetrying(false);
        return result;
      } catch (error) {
        currentAttempt++;
        setAttempts(currentAttempt);

        if (currentAttempt >= maxAttempts) {
          setIsRetrying(false);
          throw error;
        }

        const waitTime = backoff ? delay * Math.pow(2, currentAttempt - 1) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    setIsRetrying(false);
    throw new Error('Max retry attempts reached');
  }, [asyncFn, maxAttempts, delay, backoff]);

  return { retry, attempts, isRetrying };
}

