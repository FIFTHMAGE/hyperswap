/**
 * Modal footer component
 * @module components/ui/Modal/ModalFooter
 */

'use client';

import { type ReactNode } from 'react';
import { styled } from 'nativewind';

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default styled(ModalFooter);

