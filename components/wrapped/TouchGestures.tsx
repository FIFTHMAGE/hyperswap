'use client';

import { useEffect, useRef } from 'react';

interface Props {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
}

export function TouchGestures({ onSwipeLeft, onSwipeRight, onTap }: Props) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX.current - touchEndX;
      const diffY = touchStartY.current - touchEndY;

      // Check if swipe is mostly horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
      // If minimal movement, treat as tap
      else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        onTap();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onTap]);

  return null;
}

