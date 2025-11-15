/**
 * Progress bar component with animation
 * @module components/feedback
 */

'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  animated?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export function ProgressBar({
  progress,
  showLabel = false,
  animated = true,
  color = 'blue',
  className = '',
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
    // For non-animated, let state initialization handle it
  }, [progress, animated]);

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  const clampedProgress = Math.min(Math.max(displayProgress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
