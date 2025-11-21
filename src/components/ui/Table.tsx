/**
 * Table - Data table component
 * @module components/ui
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  return (
    <View className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <ScrollView horizontal>
        <View className="min-w-full">
          {/* Header */}
          <View className="flex-row bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <View
                key={column.key}
                className="px-6 py-3 flex-1"
                style={{ width: column.width || 'auto' }}
              >
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </Text>
              </View>
            ))}
          </View>

          {/* Body */}
          {data.length === 0 ? (
            <View className="px-6 py-12 text-center">
              <Text className="text-gray-500">{emptyMessage}</Text>
            </View>
          ) : (
            data.map((item, index) => (
              <View
                key={keyExtractor(item, index)}
                className={`flex-row ${index !== data.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {columns.map((column) => (
                  <View
                    key={column.key}
                    className="px-6 py-4 flex-1"
                    style={{ width: column.width || 'auto' }}
                  >
                    <Text className="text-sm text-gray-900">
                      {column.render ? column.render(item) : item[column.key]}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
