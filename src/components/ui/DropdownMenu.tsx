/**
 * DropdownMenu - Dropdown menu component
 * @module components/ui
 */

import React, { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';

import { useClickOutside } from '../../hooks/useClickOutside';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  position = 'right',
  className = '',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <View ref={dropdownRef} className={`relative ${className}`}>
      <Pressable onPress={() => setIsOpen(!isOpen)}>{trigger}</Pressable>

      {isOpen && (
        <View
          className={`
            absolute
            top-full
            mt-2
            ${position === 'left' ? 'left-0' : 'right-0'}
            min-w-48
            bg-white
            rounded-lg
            shadow-lg
            border
            border-gray-200
            z-50
          `}
        >
          {items.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                flex-row
                items-center
                px-4
                py-3
                ${index !== 0 ? 'border-t border-gray-100' : ''}
                ${item.disabled ? 'opacity-50' : 'hover:bg-gray-50'}
              `}
            >
              {item.icon && <View className="mr-3">{item.icon}</View>}
              <Text className="text-gray-900">{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
