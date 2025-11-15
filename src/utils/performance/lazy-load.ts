/**
 * Lazy loading utilities for code splitting
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load component with loading state
export function lazyLoad<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  loading?: ComponentType
) {
  return dynamic(importFunc, {
    loading: loading ? () => loading({} as P) : undefined,
    ssr: true,
  });
}

// Lazy load with no SSR
export function lazyLoadClient<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  loading?: ComponentType
) {
  return dynamic(importFunc, {
    loading: loading ? () => loading({} as P) : undefined,
    ssr: false,
  });
}

// Preload component
export function preloadComponent(importFunc: () => Promise<{ default: ComponentType }>): void {
  importFunc();
}
