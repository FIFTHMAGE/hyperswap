export interface SwipeData {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface TouchGestureHandlers {
  onSwipe?: (data: SwipeData) => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
}

export function useTouchGestures(element: HTMLElement | null, handlers: TouchGestureHandlers) {
  if (!element) return;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let lastTap = 0;
  let initialDistance = 0;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    } else if (e.touches.length === 2 && handlers.onPinch) {
      initialDistance = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && handlers.onPinch && initialDistance) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;
      handlers.onPinch(scale);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches.length === 1 && handlers.onSwipe) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const velocity = distance / deltaTime;

      if (distance > 50 && velocity > 0.3) {
        let direction: SwipeData['direction'];
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        handlers.onSwipe({ direction, distance, velocity });
      }
    }

    // Double tap detection
    if (handlers.onDoubleTap) {
      const now = Date.now();
      if (now - lastTap < 300) {
        handlers.onDoubleTap();
      }
      lastTap = now;
    }

    initialDistance = 0;
  };

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

function getDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx ** 2 + dy ** 2);
}

