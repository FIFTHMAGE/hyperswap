/**
 * Modal body component
 * @module components/ui/Modal/ModalBody
 */

'use client';

import { styled } from 'nativewind';
import { type ReactNode } from 'react';

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export default styled(ModalBody);
