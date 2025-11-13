import { PanInfo } from 'framer-motion';

export function detectSwipeDirection(
  info: PanInfo
): 'left' | 'right' | 'up' | 'down' | null {
  const { offset, velocity } = info;
  const swipeConfidenceThreshold = 10000;
  const swipePower = Math.abs(offset.x) * velocity.x;

  if (swipePower < -swipeConfidenceThreshold) {
    return 'left';
  } else if (swipePower > swipeConfidenceThreshold) {
    return 'right';
  }

  return null;
}

export function handleCardSwipe(
  direction: 'left' | 'right' | null,
  onNext: () => void,
  onPrevious: () => void
): void {
  if (direction === 'left') {
    onNext();
  } else if (direction === 'right') {
    onPrevious();
  }
}

