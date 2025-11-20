/**
 * Badge - Reusable badge component
 * @module components/ui
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <View
      className={`
        ${getVariantStyles(variant)}
        ${getSizeStyles(size)}
        rounded-full
        items-center
        justify-center
        ${className}
      `}
    >
      <Text
        className={`
          ${getTextStyles(variant)}
          ${getTextSizeStyles(size)}
          font-semibold
        `}
      >
        {children}
      </Text>
    </View>
  );
}

function getVariantStyles(variant: BadgeProps['variant']): string {
  switch (variant) {
    case 'default':
      return 'bg-gray-100';
    case 'success':
      return 'bg-green-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'error':
      return 'bg-red-100';
    case 'info':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
}

function getTextStyles(variant: BadgeProps['variant']): string {
  switch (variant) {
    case 'default':
      return 'text-gray-800';
    case 'success':
      return 'text-green-800';
    case 'warning':
      return 'text-yellow-800';
    case 'error':
      return 'text-red-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-gray-800';
  }
}

function getSizeStyles(size: BadgeProps['size']): string {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5';
    case 'md':
      return 'px-3 py-1';
    case 'lg':
      return 'px-4 py-1.5';
    default:
      return 'px-3 py-1';
  }
}

function getTextSizeStyles(size: BadgeProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
}
