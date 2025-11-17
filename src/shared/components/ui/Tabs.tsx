/**
 * Tabs component
 * @module components/ui
 */

'use client';

import { useState, type ReactNode } from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function Tabs({ items, defaultIndex = 0, onChange, className = '' }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    if (items[index].disabled) return;

    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <div className={className}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              disabled={item.disabled}
              className={`
                px-4 py-2 font-medium text-sm border-b-2 transition-colors
                ${
                  activeIndex === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">{items[activeIndex]?.content}</div>
    </div>
  );
}
