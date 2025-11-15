/**
 * Component utility functions
 */

import { ClassValue, clsx } from 'clsx';

// Combine class names (works with Tailwind/NativeWind)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Generate test ID for components
export function generateTestId(component: string, variant?: string): string {
  return variant ? `${component}-${variant}` : component;
}

// Format component display name for debugging
export function formatDisplayName(name: string, variant?: string): string {
  return variant ? `${name}(${variant})` : name;
}

// Check if component is in viewport (for lazy loading)
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Prevent event propagation helper
export function stopPropagation<T>(handler: (event: T) => void) {
  return (event: T & { stopPropagation?: () => void }) => {
    event.stopPropagation?.();
    handler(event);
  };
}

// Async handler wrapper for components
export function asyncHandler<T>(
  handler: (event: T) => Promise<void>,
  onError?: (error: Error) => void
) {
  return async (event: T) => {
    try {
      await handler(event);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
      console.error('Component async handler error:', err);
    }
  };
}

