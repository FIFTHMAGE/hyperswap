/**
 * Section layout component
 * @module components/layouts
 */

'use client';

import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Section({
  children,
  title,
  description,
  padding = 'md',
  className = '',
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
  };

  return (
    <section className={`${paddingClasses[padding]} ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          )}
          {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
