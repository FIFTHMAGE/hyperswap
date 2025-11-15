'use client';

import { motion } from 'framer-motion';

interface Props {
  predictions: {
    title: string;
    confidence: number;
  }[];
}

export function PredictionsCard({ predictions }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-4">
          2025 Predictions
        </h1>
        <p className="text-2xl text-white/70 text-center mb-12">
          What's next for you?
        </p>

        <div className="space-y-6">
          {predictions.map((pred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-bold text-white">{pred.title}</h3>
                <span className="text-lg font-semibold text-white/70">
                  {pred.confidence}% likely
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidence}%` }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

