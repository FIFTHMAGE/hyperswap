'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StoryCardProps {
  children: ReactNode;
  gradient?: string;
}

export function StoryCard({ children, gradient = 'from-purple-900 to-pink-900' }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-screen flex items-center justify-center bg-gradient-to-br ${gradient} p-8`}
    >
      <div className="max-w-2xl w-full">
        {children}
      </div>
    </motion.div>
  );
}

