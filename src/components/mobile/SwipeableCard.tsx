/**
 * Swipeable card component for mobile
 * @module components/mobile
 */

'use client';

import { useState, useRef, type ReactNode } from 'react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = '',
}: SwipeableCardProps) {
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    setOffset(currentX - startX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(offset) > threshold) {
      if (offset > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setOffset(0);
    setStartX(0);
  };

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`transition-transform ${className}`}
      style={{ transform: `translateX(${offset}px)` }}
    >
      {children}
    </div>
  );
}
