/**
 * Avatar - User avatar component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Image } from 'react-native';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className = '' }: AvatarProps) {
  const initials = fallback || alt?.substring(0, 2).toUpperCase() || '?';

  return (
    <View
      className={`
        ${getSizeStyles(size)}
        rounded-full
        bg-indigo-100
        items-center
        justify-center
        overflow-hidden
        ${className}
      `}
    >
      {src ? (
        <Image source={{ uri: src }} className="w-full h-full" resizeMode="cover" />
      ) : (
        <Text
          className={`
            ${getTextSizeStyles(size)}
            font-semibold
            text-indigo-600
          `}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

function getSizeStyles(size: AvatarProps['size']): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8';
    case 'md':
      return 'w-10 h-10';
    case 'lg':
      return 'w-12 h-12';
    case 'xl':
      return 'w-16 h-16';
    default:
      return 'w-10 h-10';
  }
}

function getTextSizeStyles(size: AvatarProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    case 'xl':
      return 'text-xl';
    default:
      return 'text-sm';
  }
}
