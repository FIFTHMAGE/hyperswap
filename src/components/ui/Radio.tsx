/**
 * Radio - Radio button component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function Radio({ options, value, onChange, disabled = false, className = '' }: RadioProps) {
  return (
    <View className={className}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className="flex-row items-center mb-2"
        >
          <View
            className={`
              w-5
              h-5
              rounded-full
              border-2
              ${value === option.value ? 'border-indigo-600' : 'border-gray-300'}
              ${disabled ? 'opacity-50' : ''}
              items-center
              justify-center
            `}
          >
            {value === option.value && <View className="w-3 h-3 rounded-full bg-indigo-600" />}
          </View>

          <Text className={`ml-2 text-gray-900 ${disabled ? 'opacity-50' : ''}`}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
