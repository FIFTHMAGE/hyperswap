/**
 * Overlay component
 * @module components/ui
 */

'use client';

import type { ReactNode } from 'react';

interface OverlayProps {
  isOpen: boolean;
  children?: ReactNode;
  onClose?: () => void;
  blur?: boolean;
  className?: string;
}

export function Overlay({ isOpen, children, onClose, blur = false, className = '' }: OverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/50 ${blur ? 'backdrop-blur-sm' : ''} ${className}`}
      onClick={onClose}
    >
      {children && (
        <div
          className="flex items-center justify-center min-h-screen p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}
