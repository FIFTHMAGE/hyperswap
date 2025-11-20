/**
 * Select - Reusable select/dropdown component
 * @module components/ui
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  containerClassName?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  containerClassName = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>}

      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`
          bg-white
          border
          rounded-xl
          px-4
          py-3
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        <Text className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </Pressable>

      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setIsOpen(false)}>
          <View className="bg-white rounded-t-3xl max-h-96">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">
                {label || 'Select an option'}
              </Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  className={`
                    p-4
                    border-b
                    border-gray-100
                    ${item.value === value ? 'bg-indigo-50' : ''}
                  `}
                >
                  <Text
                    className={`
                      text-base
                      ${item.value === value ? 'text-indigo-600 font-semibold' : 'text-gray-900'}
                    `}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return (
    <View
      className={`
        bg-white
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className = '' }: SelectContentProps) {
  return (
    <View
      className={`
        bg-white
        rounded-xl
        shadow-lg
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function SelectItem({ children, value, onSelect, className = '' }: SelectItemProps) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className={`
        p-4
        border-b
        border-gray-100
        ${className}
      `}
    >
      <Text className="text-base text-gray-900">{children}</Text>
    </Pressable>
  );
}

export interface SelectValueProps {
  children: React.ReactNode;
  placeholder?: string;
}

export function SelectValue({ children, placeholder }: SelectValueProps) {
  return <Text className="text-gray-900">{children || placeholder}</Text>;
}
