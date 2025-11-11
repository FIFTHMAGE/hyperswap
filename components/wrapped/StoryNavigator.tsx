'use client';

import { motion } from 'framer-motion';

interface StoryNavigatorProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function StoryNavigator({
  currentIndex,
  total,
  onNext,
  onPrevious,
}: StoryNavigatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Progress bars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
          >
            {index <= currentIndex && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
                className="h-full bg-white"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="p-2 text-white disabled:opacity-30"
        >
          ← Previous
        </button>
        <span className="text-white/70 text-sm">
          {currentIndex + 1} / {total}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="p-2 text-white disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

