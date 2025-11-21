/**
 * Alert - Alert/notification component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  children,
  variant = 'default',
  title,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  return (
    <View
      className={`
        ${getVariantStyles(variant)}
        rounded-xl
        p-4
        ${className}
      `}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          {title && (
            <Text
              className={`
                ${getTextStyles(variant)}
                font-semibold
                text-base
                mb-1
              `}
            >
              {title}
            </Text>
          )}
          <Text
            className={`
              ${getTextStyles(variant)}
              text-sm
            `}
          >
            {children}
          </Text>
        </View>

        {dismissible && onDismiss && (
          <Pressable onPress={onDismiss} className="ml-3">
            <Text className={`${getTextStyles(variant)} text-xl`}>×</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function getVariantStyles(variant: AlertProps['variant']): string {
  switch (variant) {
    case 'default':
      return 'bg-gray-100 border border-gray-300';
    case 'success':
      return 'bg-green-50 border border-green-300';
    case 'warning':
      return 'bg-yellow-50 border border-yellow-300';
    case 'error':
      return 'bg-red-50 border border-red-300';
    case 'info':
      return 'bg-blue-50 border border-blue-300';
    default:
      return 'bg-gray-100 border border-gray-300';
  }
}

function getTextStyles(variant: AlertProps['variant']): string {
  switch (variant) {
    case 'default':
      return 'text-gray-900';
    case 'success':
      return 'text-green-900';
    case 'warning':
      return 'text-yellow-900';
    case 'error':
      return 'text-red-900';
    case 'info':
      return 'text-blue-900';
    default:
      return 'text-gray-900';
  }
}
