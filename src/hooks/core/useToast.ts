/**
 * Toast notifications hook
 * @module hooks/core/useToast
 */

import { useEffect, useState } from 'react';
import { toastService, type Toast } from '@/services/notification/toast.service';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe((toast) => {
      setToasts(prev => [...prev, toast]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration || 5000);
    });

    return unsubscribe;
  }, []);

  const success = (message: string, description?: string) => {
    toastService.success(message, description);
  };

  const error = (message: string, description?: string) => {
    toastService.error(message, description);
  };

  const warning = (message: string, description?: string) => {
    toastService.warning(message, description);
  };

  const info = (message: string, description?: string) => {
    toastService.info(message, description);
  };

  return {
    toasts,
    success,
    error,
    warning,
    info,
  };
}

