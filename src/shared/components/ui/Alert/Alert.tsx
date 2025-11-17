/**
 * Alert component with types
 * @module components/ui/Alert
 */

'use client';

import { styled } from 'nativewind';
import { type ReactNode } from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', children, onClose, className = '' }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`flex items-start p-4 border rounded-lg ${typeClasses[type]} ${className}`}>
      <span className="mr-3 text-lg">{icons[type]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-current opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default styled(Alert);
