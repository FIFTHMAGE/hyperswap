/**
 * Modal component with accessibility
 * @module components/ui/Modal
 */

'use client';

import { styled } from 'nativewind';
import { useEffect, type ReactNode } from 'react';
import { useRef } from 'react';

import { useOnClickOutside } from '@/hooks/core/useOnClickOutside';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnEscape = true,
  closeOnClickOutside = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, () => {
    if (closeOnClickOutside) onClose();
  });

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

export default styled(Modal);
