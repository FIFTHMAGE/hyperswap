/**
 * Story navigator with keyboard navigation
 * @module components/wrapped/StoryNavigator
 */

'use client';

import { useEffect, useCallback } from 'react';
import { styled } from 'nativewind';

interface StoryNavigatorProps {
  currentIndex: number;
  totalStories: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

const StoryNavigator: React.FC<StoryNavigatorProps> = ({
  currentIndex,
  totalStories,
  onNext,
  onPrevious,
  onClose,
}) => {
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          onNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          onPrevious();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ':
          event.preventDefault();
          onNext();
          break;
      }
    },
    [onNext, onPrevious, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Progress indicators */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: totalStories }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < currentIndex
                ? 'bg-white'
                : index === currentIndex
                ? 'bg-white/50'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          aria-label="Previous story"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close stories"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={onNext}
          disabled={currentIndex === totalStories - 1}
          className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          aria-label="Next story"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-center text-white/60 text-sm">
        Use arrow keys, space, or swipe to navigate • Press ESC to close
      </div>
    </div>
  );
};

export default styled(StoryNavigator);

