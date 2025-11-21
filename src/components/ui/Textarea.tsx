/**
 * TextArea - Multi-line text input component
 * @module components/ui
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  maxLength?: number;
  className?: string;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error,
  label,
  maxLength,
  className = '',
}: TextAreaProps) {
  return (
    <View className={className}>
      {label && <Text className="block text-sm font-medium text-gray-700 mb-1">{label}</Text>}

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        multiline
        numberOfLines={rows}
        maxLength={maxLength}
        editable={!disabled}
        className={`
          w-full
          px-3
          py-2
          border
          rounded-lg
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
          focus:outline-none
          focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}
        `}
        style={{
          height: rows * 24,
          textAlignVertical: 'top',
        }}
      />

      {error && <Text className="mt-1 text-sm text-red-600">{error}</Text>}

      {maxLength && (
        <Text className="mt-1 text-sm text-gray-500 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}
