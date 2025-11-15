'use client';

import { motion } from 'framer-motion';

interface Milestone {
  title: string;
  date: string;
  description: string;
  emoji: string;
}

interface Props {
  milestones: Milestone[];
}

export function MilestoneCard({ milestones }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Key Milestones
        </h1>

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex items-start gap-6"
            >
              <div className="text-6xl">{milestone.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-3xl font-bold text-white">{milestone.title}</h3>
                  <span className="text-white/70 text-sm">{milestone.date}</span>
                </div>
                <p className="text-xl text-white/80">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

