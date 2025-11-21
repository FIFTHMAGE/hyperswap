/**
 * Switch - Toggle switch component
 * @module components/ui
 */

import React from 'react';
import { View, Pressable } from 'react-native';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        ${getSizeStyles(size).container}
        ${checked ? 'bg-indigo-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50' : ''}
        rounded-full
        transition-colors
        ${className}
      `}
    >
      <View
        className={`
          ${getSizeStyles(size).thumb}
          bg-white
          rounded-full
          shadow-md
          transition-transform
          ${checked ? getSizeStyles(size).thumbChecked : 'translate-x-0'}
        `}
      />
    </Pressable>
  );
}

function getSizeStyles(size: SwitchProps['size']) {
  switch (size) {
    case 'sm':
      return {
        container: 'w-8 h-4 p-0.5',
        thumb: 'w-3 h-3',
        thumbChecked: 'translate-x-4',
      };
    case 'md':
      return {
        container: 'w-11 h-6 p-1',
        thumb: 'w-4 h-4',
        thumbChecked: 'translate-x-5',
      };
    case 'lg':
      return {
        container: 'w-14 h-7 p-1',
        thumb: 'w-5 h-5',
        thumbChecked: 'translate-x-7',
      };
    default:
      return {
        container: 'w-11 h-6 p-1',
        thumb: 'w-4 h-4',
        thumbChecked: 'translate-x-5',
      };
  }
}
