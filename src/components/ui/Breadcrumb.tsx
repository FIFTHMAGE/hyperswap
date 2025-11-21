/**
 * Breadcrumb - Navigation breadcrumb component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export function Breadcrumb({ items, separator = '/', className = '' }: BreadcrumbProps) {
  return (
    <View className={`flex-row items-center flex-wrap ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={index} className="flex-row items-center">
            {item.onClick ? (
              <Pressable onPress={item.onClick}>
                <Text
                  className={`
                    ${isLast ? 'text-gray-900 font-medium' : 'text-indigo-600 hover:text-indigo-700'}
                  `}
                >
                  {item.label}
                </Text>
              </Pressable>
            ) : (
              <Text className={isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                {item.label}
              </Text>
            )}

            {!isLast && <Text className="mx-2 text-gray-400">{separator}</Text>}
          </View>
        );
      })}
    </View>
  );
}
