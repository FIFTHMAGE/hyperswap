/**
 * Skeleton - Loading skeleton component
 * @module components/ui
 */

import React from 'react';
import { View } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width, height = 20, className = '' }: SkeletonProps) {
  return (
    <View
      className={`
        bg-gray-200
        rounded-lg
        animate-pulse
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? width : width || '100%',
        height: typeof height === 'number' ? height : height,
      }}
    />
  );
}
