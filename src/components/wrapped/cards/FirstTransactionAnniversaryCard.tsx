'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/date';

interface FirstTransactionAnniversaryCardProps {
  firstTransactionDate: string;
  daysActive: number;
}

export function FirstTransactionAnniversaryCard({ 
  firstTransactionDate, 
  daysActive 
}: FirstTransactionAnniversaryCardProps) {
  const years = Math.floor(daysActive / 365);
  
  return (
    <StoryCard gradient="from-rose-900 to-pink-900">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-6xl"
        >
          🎂
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">
          Your Crypto Anniversary
        </h2>
        
        <div className="space-y-4">
          <p className="text-2xl text-white/90">
            First transaction on
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-pink-400"
          >
            {formatDate(firstTransactionDate, 'MMM dd, yyyy')}
          </motion.div>
          <p className="text-xl text-white/70">
            {daysActive} days ago
            {years > 0 && ` (${years} ${years === 1 ? 'year' : 'years'}!)`}
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

