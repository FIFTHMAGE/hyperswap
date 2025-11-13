import { Variants } from 'framer-motion';

export const cardSwipeVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const zoomVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.2, opacity: 0 },
};

export const rotateVariants: Variants = {
  initial: { rotate: -10, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: 10, opacity: 0 },
};

