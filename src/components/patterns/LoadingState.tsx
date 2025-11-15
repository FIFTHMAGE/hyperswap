/**
 * Reusable loading state component pattern
 */

import React from 'react';
import { BaseComponentProps } from '../shared/prop-types';

export interface LoadingStateProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`} />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

