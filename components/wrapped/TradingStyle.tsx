'use client';

import { motion } from 'framer-motion';

interface Props {
  style: {
    type: 'Conservative' | 'Balanced' | 'Aggressive' | 'Degen';
    traits: string[];
    emoji: string;
  };
}

export function TradingStyle({ style }: Props) {
  const colors = {
    Conservative: 'from-blue-900 to-cyan-900',
    Balanced: 'from-green-900 to-teal-900',
    Aggressive: 'from-orange-900 to-red-900',
    Degen: 'from-purple-900 to-pink-900',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors[style.type]} flex items-center justify-center p-6`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="max-w-4xl w-full text-center"
      >
        <div className="text-9xl mb-8">{style.emoji}</div>
        <h1 className="text-7xl font-extrabold text-white mb-6">
          {style.type}
        </h1>
        <p className="text-3xl text-white/80 mb-12">
          That's your trading style!
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Your Traits:</h3>
          <div className="space-y-4">
            {style.traits.map((trait, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="text-xl text-white"
              >
                ✓ {trait}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

