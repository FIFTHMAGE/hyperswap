/**
 * Loading wrapper pattern component
 * @module components/patterns
 */

'use client';

import type { ReactNode } from 'react';

import { LoadingScreen } from '../features/LoadingScreen';

interface WithLoadingProps {
  isLoading: boolean;
  children: ReactNode;
  loadingMessage?: string;
  className?: string;
}

export function WithLoading({
  isLoading,
  children,
  loadingMessage,
  className = '',
}: WithLoadingProps) {
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} fullScreen={false} className={className} />;
  }

  return <>{children}</>;
}
