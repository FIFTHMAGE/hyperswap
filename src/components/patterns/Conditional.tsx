/**
 * Conditional rendering pattern component
 * @module components/patterns
 */

'use client';

import type { ReactNode } from 'react';

interface ConditionalProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Conditional({ condition, children, fallback = null }: ConditionalProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}
