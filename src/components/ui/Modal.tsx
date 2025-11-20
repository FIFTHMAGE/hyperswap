/**
 * Modal - Reusable modal component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Modal as RNModal, Pressable, ScrollView } from 'react-native';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  return (
    <RNModal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View
          className={`
            bg-white
            rounded-3xl
            ${getSizeStyles(size)}
            max-h-[90%]
          `}
        >
          {(title || showClose) && (
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
              {title && <Text className="text-xl font-bold text-gray-900">{title}</Text>}

              {showClose && (
                <Pressable onPress={onClose} className="w-8 h-8 items-center justify-center">
                  <Text className="text-2xl text-gray-400">×</Text>
                </Pressable>
              )}
            </View>
          )}

          <ScrollView className="flex-1">{children}</ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

function getSizeStyles(size: ModalProps['size']): string {
  switch (size) {
    case 'sm':
      return 'w-80';
    case 'md':
      return 'w-96';
    case 'lg':
      return 'w-[600px]';
    case 'full':
      return 'w-full h-full rounded-none';
    default:
      return 'w-96';
  }
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className = '' }: ModalHeaderProps) {
  return (
    <View
      className={`
        p-6
        border-b
        border-gray-200
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return (
    <View
      className={`
        p-6
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <View
      className={`
        p-6
        border-t
        border-gray-200
        flex-row
        justify-end
        gap-3
        ${className}
      `}
    >
      {children}
    </View>
  );
}
