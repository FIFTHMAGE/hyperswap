/**
 * Divider - Separator line component
 * @module components/ui
 */

import React from 'react';
import { View } from 'react-native';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <View
      className={`
        bg-gray-200
        ${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'}
        ${className}
      `}
    />
  );
}
