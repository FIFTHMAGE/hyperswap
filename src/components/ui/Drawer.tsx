/**
 * Drawer - Side drawer/sheet component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <Pressable onPress={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      <View
        className={`
          fixed
          top-0
          ${position === 'left' ? 'left-0' : 'right-0'}
          bottom-0
          w-80
          bg-white
          shadow-xl
          z-50
          ${className}
        `}
      >
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          {title && <Text className="text-lg font-semibold">{title}</Text>}
          <Pressable onPress={onClose} className="p-2">
            <Text className="text-2xl text-gray-500">×</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 p-4">{children}</ScrollView>
      </View>
    </>
  );
}
