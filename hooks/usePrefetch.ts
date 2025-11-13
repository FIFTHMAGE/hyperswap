'use client';

import { useEffect, useRef } from 'react';

export function usePrefetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const dataRef = useRef<T | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!isLoadingRef.current) {
      isLoadingRef.current = true;
      fetchFn().then(data => {
        dataRef.current = data;
        isLoadingRef.current = false;
      }).catch(() => {
        isLoadingRef.current = false;
      });
    }
  }, dependencies);

  return {
    data: dataRef.current,
    isLoading: isLoadingRef.current,
  };
}

export function usePrefetchOnHover(fetchFn: () => Promise<any>) {
  const hasPrefetched = useRef(false);

  const handleMouseEnter = () => {
    if (!hasPrefetched.current) {
      hasPrefetched.current = true;
      fetchFn();
    }
  };

  return { handleMouseEnter };
}

