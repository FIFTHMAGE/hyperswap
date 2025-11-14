/**
 * Modal body component
 * @module components/ui/Modal/ModalBody
 */

'use client';

import { type ReactNode } from 'react';
import { styled } from 'nativewind';

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export default styled(ModalBody);

