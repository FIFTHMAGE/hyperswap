'use client';

import { motion } from 'framer-motion';

interface Props {
  rankings: {
    category: string;
    rank: number;
    total: number;
    percentile: number;
  }[];
}

export function RankingCard({ rankings }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Your Rankings
        </h1>

        <div className="space-y-6">
          {rankings.map((ranking, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {ranking.category}
                  </h3>
                  <p className="text-white/70">
                    Top {ranking.percentile}% of users
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-yellow-400 mb-1">
                    #{ranking.rank}
                  </div>
                  <p className="text-white/60 text-sm">out of {ranking.total.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

