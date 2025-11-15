'use client';

import { useEffect } from 'react';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
}

export function KeyboardNavigation({ onNext, onPrevious, currentIndex, totalCards }: Props) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < totalCards - 1) {
        onNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrevious();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (currentIndex < totalCards - 1) {
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalCards, onNext, onPrevious]);

  return null; // This component doesn't render anything
}

