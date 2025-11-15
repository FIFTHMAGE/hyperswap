'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface ActiveDaysHeatmapCardProps {
  activeDays: number;
  totalDays: number;
  monthlyActivity: number[];
}

export function ActiveDaysHeatmapCard({ 
  activeDays, 
  totalDays,
  monthlyActivity 
}: ActiveDaysHeatmapCardProps) {
  const percentage = Math.round((activeDays / totalDays) * 100);
  
  return (
    <StoryCard gradient="from-cyan-900 to-blue-900">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white text-center">
          Activity Heatmap
        </h2>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <div className="text-6xl font-extrabold text-cyan-400">
            {activeDays}
          </div>
          <p className="text-xl text-white/80">
            active days ({percentage}% of the year)
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-1">
          {monthlyActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.05) }}
              className={`aspect-square rounded-sm ${
                activity > 20 ? 'bg-cyan-400' :
                activity > 10 ? 'bg-cyan-600' :
                activity > 0 ? 'bg-cyan-800' :
                'bg-white/10'
              }`}
              title={`Month ${i + 1}: ${activity} days`}
            />
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

