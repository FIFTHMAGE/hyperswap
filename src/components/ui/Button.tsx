/**
 * Button - Reusable button component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';

export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${getVariantStyles(variant)}
        ${getSizeStyles(size)}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        rounded-xl
        flex-row
        items-center
        justify-center
        transition-all
        duration-200
      `}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
      })}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#6366f1'} size="small" />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={`
              ${getTextStyles(variant)}
              ${getTextSizeStyles(size)}
              font-semibold
            `}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: ButtonProps['variant']): string {
  switch (variant) {
    case 'primary':
      return 'bg-indigo-600 active:bg-indigo-700';
    case 'secondary':
      return 'bg-gray-600 active:bg-gray-700';
    case 'outline':
      return 'bg-transparent border-2 border-indigo-600 active:bg-indigo-50';
    case 'ghost':
      return 'bg-transparent active:bg-gray-100';
    case 'danger':
      return 'bg-red-600 active:bg-red-700';
    default:
      return 'bg-indigo-600 active:bg-indigo-700';
  }
}

function getSizeStyles(size: ButtonProps['size']): string {
  switch (size) {
    case 'sm':
      return 'px-3 py-2';
    case 'md':
      return 'px-4 py-3';
    case 'lg':
      return 'px-6 py-4';
    default:
      return 'px-4 py-3';
  }
}

function getTextStyles(variant: ButtonProps['variant']): string {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
      return 'text-white';
    case 'outline':
    case 'ghost':
      return 'text-indigo-600';
    default:
      return 'text-white';
  }
}

function getTextSizeStyles(size: ButtonProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'md':
      return 'text-base';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-base';
  }
}
