/**
 * Spinner - Loading spinner component
 * @module components/ui
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export interface SpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 'large', color = '#6366f1', className = '' }: SpinnerProps) {
  return (
    <View
      className={`
        items-center
        justify-center
        ${className}
      `}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

export interface SpinnerOverlayProps {
  visible: boolean;
  message?: string;
}

export function SpinnerOverlay({ visible, message }: SpinnerOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <View className="bg-white rounded-2xl p-6 items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        {message && <View className="text-gray-700 mt-4">{message}</View>}
      </View>
    </View>
  );
}
