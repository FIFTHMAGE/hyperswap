/**
 * Pagination - Pagination component
 * @module components/ui
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  className = '',
}: PaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisible, totalPages);
    }

    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      <Pressable
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg ${currentPage === 1 ? 'opacity-50' : 'bg-white border border-gray-300'}`}
      >
        <Text>←</Text>
      </Pressable>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <Text key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </Text>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Pressable
            key={pageNum}
            onPress={() => onPageChange(pageNum)}
            className={`
              px-4
              py-2
              rounded-lg
              ${isActive ? 'bg-indigo-600' : 'bg-white border border-gray-300'}
            `}
          >
            <Text className={isActive ? 'text-white font-medium' : 'text-gray-700'}>{pageNum}</Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg ${currentPage === totalPages ? 'opacity-50' : 'bg-white border border-gray-300'}`}
      >
        <Text>→</Text>
      </Pressable>
    </View>
  );
}
