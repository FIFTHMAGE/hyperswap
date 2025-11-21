/**
 * Accordion - Collapsible accordion component
 * @module components/ui
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View className={className}>
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        const isLast = index === items.length - 1;

        return (
          <View
            key={item.id}
            className={`border border-gray-200 ${!isLast ? 'border-b-0' : ''} ${index === 0 ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
          >
            <Pressable
              onPress={() => toggleItem(item.id)}
              className="flex-row justify-between items-center p-4 bg-white"
            >
              <Text className="font-medium text-gray-900">{item.title}</Text>
              <Text className="text-gray-500 text-lg">{isOpen ? '−' : '+'}</Text>
            </Pressable>

            {isOpen && (
              <View className="p-4 bg-gray-50 border-t border-gray-200">{item.content}</View>
            )}
          </View>
        );
      })}
    </View>
  );
}
