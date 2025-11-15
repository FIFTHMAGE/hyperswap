/**
 * Skeleton loader component for loading states
 */

import React from 'react';
import { BaseComponentProps } from '../shared/prop-types';
import { cn } from '../shared/component-utils';
import { skeletonBase } from '../ui/skeleton-variants';

export interface SkeletonLoaderProps extends BaseComponentProps {
  variant?: 'text' | 'title' | 'avatar' | 'button' | 'card' | 'image' | 'custom';
  width?: string;
  height?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}) => {
  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
    card: 'h-32 w-full',
    image: 'aspect-video w-full',
    custom: '',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        skeletonBase,
        variant !== 'custom' && variantClasses[variant],
        className
      )}
      style={{
        ...(width && { width }),
        ...(height && { height }),
      }}
    />
  ));

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : <>{skeletons}</>;
};

