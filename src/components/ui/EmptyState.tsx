/**
 * EmptyState - Empty state component
 * @module components/ui
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = '' }: EmptyStateProps) {
  return (
    <View className={`flex items-center justify-center py-12 px-4 ${className}`}>
      {icon && <View className="mb-4">{icon}</View>}

      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">{title}</Text>

      {description && (
        <Text className="text-gray-500 text-center mb-6 max-w-md">{description}</Text>
      )}

      {action && (
        <Button onPress={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </View>
  );
}
