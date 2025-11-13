'use client';

import { motion } from 'framer-motion';

interface Props {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: Props) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 text-white text-sm font-semibold">
        {current + 1} / {total}
      </div>
    </div>
  );
}

