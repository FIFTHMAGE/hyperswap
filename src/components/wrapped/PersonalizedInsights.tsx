'use client';

import { motion } from 'framer-motion';

interface Insight {
  emoji: string;
  title: string;
  description: string;
}

interface Props {
  insights: Insight[];
}

export function PersonalizedInsights({ insights }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Insights Just For You
        </h1>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{insight.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3">{insight.title}</h3>
                  <p className="text-xl text-white/80">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

