/**
 * Input - Reusable input component
 * @module components/ui
 */

import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>}

      <View
        className={`
          flex-row
          items-center
          bg-white
          border
          rounded-xl
          px-4
          py-3
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:border-indigo-600
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}

      {helperText && !error && <Text className="text-sm text-gray-500 mt-1">{helperText}</Text>}
    </View>
  );
}
