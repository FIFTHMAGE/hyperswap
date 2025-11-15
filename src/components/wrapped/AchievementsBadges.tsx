'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/lib/types/wrapped';

interface Props {
  achievements: Achievement[];
}

export function AchievementsBadges({ achievements }: Props) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  const earned = achievements.filter((a) => a.earned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          Achievements Unlocked
        </h1>
        <p className="text-3xl text-white/80 text-center mb-12">
          {earned.length} / {achievements.length}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {earned.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`bg-gradient-to-br ${
                  rarityColors[achievement.rarity]
                } rounded-2xl p-6 text-center border-4 border-white/20 shadow-2xl`}
              >
                <div className="text-6xl mb-4">{achievement.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {achievement.name}
                </h3>
                <p className="text-sm text-white/80">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

