'use client';

import { motion } from 'framer-motion';

interface Props {
  facts: string[];
}

export function FunFactsCard({ facts }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-900 via-green-900 to-emerald-900 flex items-center justify-center p-6">
      <motion.div className="max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold text-white text-center mb-12">
          Fun Facts About You
        </h1>

        <div className="space-y-6">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
            >
              <p className="text-3xl text-white font-bold">{fact}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

