/**
 * Toast notification component
 * @module components/ui/Toast
 */

'use client';

import { useEffect } from 'react';
import { styled } from 'nativewind';
import type { Toast as ToastType } from '@/services/notification/toast.service';

interface ToastProps extends ToastType {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div className={`flex items-start p-4 rounded-lg shadow-lg ${typeClasses[type]} min-w-[300px] max-w-[500px]`}>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-white opacity-70 hover:opacity-100"
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
};

export default styled(Toast);

