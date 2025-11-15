'use client';

import { motion } from 'framer-motion';
import { QuarterlyBreakdown as QuarterlyData } from '@/lib/types/wrapped';

interface Props {
  data: QuarterlyData[];
}

export function QuarterlyBreakdown({ data }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full space-y-8"
      >
        <h1 className="text-6xl font-extrabold text-white text-center">
          Your Year in Quarters
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((quarter, index) => (
            <motion.div
              key={quarter.quarter}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <h2 className="text-3xl font-bold text-white mb-4">{quarter.quarter}</h2>
              <div className="space-y-3 text-white/90">
                <p className="text-xl">{quarter.transactions} transactions</p>
                <p className="text-xl">${quarter.volume.toFixed(2)} volume</p>
                <p className="text-lg text-white/70">{quarter.topActivity}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

