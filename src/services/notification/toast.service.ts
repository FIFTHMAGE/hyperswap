/**
 * Toast notification service
 * @module services/notification/toast
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toast: Toast) => void;

class ToastService {
  private listeners: ToastListener[] = [];
  private toastIdCounter = 0;

  /**
   * Subscribe to toast notifications
   */
  subscribe(listener: ToastListener): () => void {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Show a toast
   */
  private show(type: ToastType, message: string, description?: string, duration?: number): string {
    const id = `toast-${++this.toastIdCounter}`;
    
    const toast: Toast = {
      id,
      type,
      message,
      description,
      duration: duration || 5000,
    };

    this.listeners.forEach(listener => listener(toast));
    
    return id;
  }

  success(message: string, description?: string, duration?: number): string {
    return this.show('success', message, description, duration);
  }

  error(message: string, description?: string, duration?: number): string {
    return this.show('error', message, description, duration);
  }

  warning(message: string, description?: string, duration?: number): string {
    return this.show('warning', message, description, duration);
  }

  info(message: string, description?: string, duration?: number): string {
    return this.show('info', message, description, duration);
  }
}

export const toastService = new ToastService();

