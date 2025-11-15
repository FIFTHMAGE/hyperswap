/**
 * Higher-Order Component for adding loading state
 */

import React from 'react';
import { LoadingState } from '../patterns/LoadingState';

export interface WithLoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return function WithLoading(props: P & WithLoadingProps) {
    const { isLoading, loadingText, ...componentProps } = props;

    if (isLoading) {
      return <LoadingState text={loadingText} />;
    }

    return <Component {...(componentProps as P)} />;
  };
}

