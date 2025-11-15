/**
 * Container layout component
 */

import React from 'react';
import { BaseComponentProps } from '../shared/prop-types';
import { cn } from '../shared/component-utils';

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  centered = true,
  padding = true,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        centered && 'mx-auto',
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};

