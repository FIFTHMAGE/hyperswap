/**
 * Card header component
 * @module components/ui/Card/CardHeader
 */

'use client';

import { type ReactNode } from 'react';
import { styled } from 'nativewind';

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default styled(CardHeader);

