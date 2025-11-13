'use client';

import { StoryCard } from '../StoryCard';
import { motion } from 'framer-motion';

interface Milestone {
  icon: string;
  title: string;
  description: string;
  achieved: boolean;
}

interface MilestoneAchievementsCardProps {
  milestones: Milestone[];
}

export function MilestoneAchievementsCard({ milestones }: MilestoneAchievementsCardProps) {
  const achievedCount = milestones.filter(m => m.achieved).length;
  
  return (
    <StoryCard gradient="from-yellow-900 to-amber-900">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white text-center">
          Achievements Unlocked
        </h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl font-extrabold text-yellow-400">
            {achievedCount} / {milestones.length}
          </div>
          <p className="text-lg text-white/80">milestones reached</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className={`p-4 rounded-xl ${
                milestone.achieved ? 'bg-yellow-500/20' : 'bg-white/5'
              }`}
            >
              <div className="text-3xl mb-2">{milestone.icon}</div>
              <p className={`text-sm font-semibold ${
                milestone.achieved ? 'text-yellow-400' : 'text-white/40'
              }`}>
                {milestone.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </StoryCard>
  );
}

