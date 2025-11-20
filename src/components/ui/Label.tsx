/**
 * Label - Reusable label component
 * @module components/ui
 */

import React from 'react';
import { Text } from 'react-native';

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function Label({ children, required = false, className = '' }: LabelProps) {
  return (
    <Text
      className={`
        text-sm
        font-medium
        text-gray-700
        mb-2
        ${className}
      `}
    >
      {children}
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </Text>
  );
}
