/**
 * Avatar component
 * @module components/ui
 */

'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: ReactNode;
  className?: string;
}

export function Avatar({ src, alt = '', size = 'md', fallback, className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const baseClasses = `rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`;

  if (!src || imageError) {
    return (
      <div className={baseClasses}>
        {fallback || (
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
