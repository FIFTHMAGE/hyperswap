/**
 * Progress - Progress bar component
 * @module components/ui
 */

import React from 'react';
import { View } from 'react-native';

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <View
        className="bg-indigo-600 h-full rounded-full"
        style={{
          width: `${percentage}%`,
        }}
      />
    </View>
  );
}
