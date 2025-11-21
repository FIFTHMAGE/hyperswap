/**
 * LoadingOverlay - Full-screen loading overlay
 * @module components/ui
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Spinner } from './Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, message, className = '' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <View
      className={`
        fixed
        inset-0
        bg-black
        bg-opacity-50
        flex
        items-center
        justify-center
        z-50
        ${className}
      `}
    >
      <View className="bg-white rounded-lg p-8 flex items-center">
        <Spinner size="lg" />
        {message && <Text className="mt-4 text-gray-900 font-medium">{message}</Text>}
      </View>
    </View>
  );
}
