/**
 * Card body component
 * @module components/ui/Card/CardBody
 */

'use client';

import { type ReactNode } from 'react';
import { styled } from 'nativewind';

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default styled(CardBody);

