/**
 * Slider - Range slider component
 * @module components/ui
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange: _onChange,
  min = 0,
  max = 100,
  step: _step = 1,
  disabled: _disabled = false,
  showValue = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <View className={className}>
      <View className="relative">
        <View className="w-full h-2 bg-gray-200 rounded-full">
          <View className="h-full bg-indigo-600 rounded-full" style={{ width: `${percentage}%` }} />
        </View>

        <View
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-md"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </View>

      {showValue && (
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-500">{min}</Text>
          <Text className="text-sm font-medium text-gray-900">{value}</Text>
          <Text className="text-sm text-gray-500">{max}</Text>
        </View>
      )}
    </View>
  );
}
