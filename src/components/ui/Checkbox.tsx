/**
 * Checkbox - Checkbox input component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`flex-row items-center ${className}`}
    >
      <View
        className={`
          w-5
          h-5
          rounded
          border-2
          ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}
          ${disabled ? 'opacity-50' : ''}
          items-center
          justify-center
        `}
      >
        {checked && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>

      {label && (
        <Text className={`ml-2 text-gray-900 ${disabled ? 'opacity-50' : ''}`}>{label}</Text>
      )}
    </Pressable>
  );
}
