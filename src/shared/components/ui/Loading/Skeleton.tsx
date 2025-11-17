/**
 * Skeleton loading component
 * @module components/ui/Loading/Skeleton
 */

'use client';

import { styled } from 'nativewind';

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  className = '',
}) => {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default styled(Skeleton);
