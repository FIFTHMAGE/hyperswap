/**
 * Mobile Modal Components
 * Bottom sheets, full-screen modals, and action sheets for mobile
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
  showHandle?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  showHandle = true,
}: BottomSheetProps) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  const heightClasses = {
    auto: 'max-h-[80vh]',
    half: 'h-[50vh]',
    full: 'h-[calc(100vh-env(safe-area-inset-top))]',
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`
          absolute bottom-0 left-0 right-0
          bg-white rounded-t-3xl shadow-2xl
          ${heightClasses[height]}
          transition-transform duration-300
          ${isDragging ? '' : 'ease-out'}
        `}
        style={{
          transform: `translateY(${currentY}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="pt-3 pb-2 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 active:scale-95"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto pb-safe-area-bottom">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Full Screen Modal
 */
interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
}

export function FullScreenModal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
}: FullScreenModalProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-50 bg-white animate-slide-up">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 safe-area-top">
        <div className="px-4 py-4 flex items-center justify-between">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-2xl active:scale-95"
            >
              ←
            </button>
          )}
          {title && <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>}
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="h-full overflow-y-auto pb-safe-area-bottom">
        {children}
      </div>
    </div>,
    document.body
  );
}

/**
 * Action Sheet
 */
interface ActionSheetAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
  cancelLabel?: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  actions,
  cancelLabel = 'Cancel',
}: ActionSheetProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 animate-slide-up pb-safe-area-bottom">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          {title && (
            <div className="px-4 py-3 text-center text-sm text-gray-500 border-b border-gray-200">
              {title}
            </div>
          )}

          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                if (!action.disabled) {
                  action.onClick();
                  onClose();
                }
              }}
              disabled={action.disabled}
              className={`
                w-full px-4 py-4 flex items-center justify-center gap-3
                transition-colors border-b border-gray-100 last:border-0
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'active:bg-gray-50'}
                ${action.variant === 'danger' ? 'text-red-600' : 'text-blue-600'}
              `}
            >
              {action.icon && <span className="text-xl">{action.icon}</span>}
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-4 bg-white rounded-2xl font-semibold text-gray-700 active:bg-gray-50 transition-colors shadow-xl"
        >
          {cancelLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}

/**
 * Confirmation Dialog
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-scale-in">
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium active:scale-95 transition-transform"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`
                flex-1 px-4 py-3 rounded-xl font-medium text-white active:scale-95 transition-transform
                ${variant === 'danger' 
                  ? 'bg-red-500 active:bg-red-600' 
                  : 'bg-blue-600 active:bg-blue-700'
                }
              `}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Toast Notification
 */
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-orange-500',
  };

  return createPortal(
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <div className={`${colors[type]} text-white rounded-xl shadow-2xl p-4 flex items-center gap-3`}>
        <span className="text-2xl">{icons[type]}</span>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="p-1 active:scale-95"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}

