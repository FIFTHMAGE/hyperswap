'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Props {
  error: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg"
      >
        <div className="text-8xl mb-8">😕</div>
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-xl text-white/80 mb-8">{error}</p>
        <Button onClick={onRetry} size="lg">
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}

