'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'left-0 top-1/2 -translate-x-full -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-full -translate-y-1/2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute ${positions[position]} px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none`}
          >
            {content}
            <div className="absolute w-2 h-2 bg-gray-800 rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

