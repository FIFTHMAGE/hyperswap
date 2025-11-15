'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface UserComparisonCardProps {
  userValue: number;
  averageValue: number;
  metric: string;
  unit: string;
}

export function UserComparisonCard({ 
  userValue, 
  averageValue, 
  metric,
  unit 
}: UserComparisonCardProps) {
  const percentDiff = ((userValue - averageValue) / averageValue) * 100;
  const isAboveAverage = percentDiff > 0;
  
  return (
    <StoryCard gradient="from-teal-900 to-cyan-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          You vs Average User
        </h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-lg text-white/70 mb-2">You</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-extrabold text-teal-400"
            >
              {userValue.toLocaleString()} {unit}
            </motion.div>
          </div>
          
          <div className="text-4xl text-white">vs</div>
          
          <div>
            <p className="text-lg text-white/70 mb-2">Average</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-white/80"
            >
              {averageValue.toLocaleString()} {unit}
            </motion.div>
          </div>
        </div>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-2xl font-semibold ${
            isAboveAverage ? 'text-green-400' : 'text-blue-400'
          }`}
        >
          {isAboveAverage ? `${Math.abs(percentDiff).toFixed(0)}% above average!` : 
           percentDiff < 0 ? `${Math.abs(percentDiff).toFixed(0)}% below average` :
           'Right at average!'}
        </motion.p>
      </div>
    </StoryCard>
  );
}

