'use client';

import { motion } from 'framer-motion';
import { DeFiActivity } from '@/lib/types/wrapped';

interface Props {
  activities: DeFiActivity[];
}

export function DeFiTimeline({ activities }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Your DeFi Journey
        </h1>
        
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.protocol}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{activity.protocol}</h3>
                  <p className="text-white/70 capitalize">{activity.category}</p>
                </div>
                <span className="text-3xl font-bold text-green-400">
                  +${activity.profit.toFixed(0)}
                </span>
              </div>
              <div className="mt-4 flex gap-6 text-white/80">
                <span>{activity.interactions} interactions</span>
                <span>${activity.volume.toFixed(0)} volume</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

