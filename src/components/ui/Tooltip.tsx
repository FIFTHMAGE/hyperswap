/**
 * Tooltip - Tooltip component
 * @module components/ui
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className={`relative ${className}`}>
      <Pressable onPressIn={() => setVisible(true)} onPressOut={() => setVisible(false)}>
        {children}
      </Pressable>

      {visible && (
        <View
          className={`
            absolute
            bg-gray-900
            text-white
            px-3
            py-2
            rounded-lg
            z-50
            ${getPositionStyles(position)}
          `}
        >
          <Text className="text-white text-xs whitespace-nowrap">{content}</Text>
        </View>
      )}
    </View>
  );
}

function getPositionStyles(position: TooltipProps['position']): string {
  switch (position) {
    case 'top':
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2';
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2 mr-2';
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2 ml-2';
    default:
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  }
}
