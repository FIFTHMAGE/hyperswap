/**
 * Bottom sheet component for mobile interfaces
 * @module components/mobile
 */

'use client';

import { useEffect, type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up ${className}`}
      >
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
        {title && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
