/**
 * Error wrapper pattern component
 * @module components/patterns
 */

'use client';

import type { ReactNode } from 'react';

import { ErrorMessage } from '../features/ErrorMessage';

interface WithErrorProps {
  error: Error | null;
  children: ReactNode;
  onRetry?: () => void;
  className?: string;
}

export function WithError({ error, children, onRetry, className = '' }: WithErrorProps) {
  if (error) {
    return <ErrorMessage message={error.message} onRetry={onRetry} className={className} />;
  }

  return <>{children}</>;
}
