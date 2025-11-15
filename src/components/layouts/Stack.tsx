/**
 * Stack layout component
 * @module components/layouts
 */

'use client';

import type { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 2 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export function Stack({
  children,
  direction = 'vertical',
  spacing = 4,
  align = 'stretch',
  justify = 'start',
  className = '',
}: StackProps) {
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';

  const spacingClasses = {
    2: direction === 'horizontal' ? 'gap-x-2' : 'gap-y-2',
    4: direction === 'horizontal' ? 'gap-x-4' : 'gap-y-4',
    6: direction === 'horizontal' ? 'gap-x-6' : 'gap-y-6',
    8: direction === 'horizontal' ? 'gap-x-8' : 'gap-y-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={`flex ${directionClass} ${spacingClasses[spacing]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
}
