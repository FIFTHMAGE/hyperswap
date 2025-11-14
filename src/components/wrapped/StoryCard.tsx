/**
 * Base story card component with animations
 * @module components/wrapped/StoryCard
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { styled } from 'nativewind';
import type { ReactNode } from 'react';

interface StoryCardProps {
  children: ReactNode;
  isActive: boolean;
  direction: 'forward' | 'backward';
  gradientFrom?: string;
  gradientTo?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  children,
  isActive,
  direction,
  gradientFrom = '#6366f1',
  gradientTo = '#8b5cf6',
}) => {
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      {isActive && (
        <motion.div
          key="story-card"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          }}
        >
          {/* Content */}
          <div className="relative z-10 w-full h-full p-8 flex flex-col justify-center items-center text-white">
            {children}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default styled(StoryCard);

