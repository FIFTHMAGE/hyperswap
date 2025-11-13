'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GasOptimizer, GasEstimate } from '@/lib/utils/gas-optimizer';

export function GasPriceOptimizer() {
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [selected, setSelected] = useState<'slow' | 'average' | 'fast'>('average');

  useEffect(() => {
    loadGasPrices();
    const interval = setInterval(loadGasPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadGasPrices = async () => {
    const estimate = await GasOptimizer.fetchGasPrices(1);
    setGasEstimate(estimate);
  };

  if (!gasEstimate) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Gas Price</h3>
      <div className="grid grid-cols-3 gap-3">
        {(['slow', 'average', 'fast'] as const).map((speed) => (
          <button
            key={speed}
            onClick={() => setSelected(speed)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selected === speed
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{speed}</p>
            <p className="text-lg font-bold">{gasEstimate[speed].price} Gwei</p>
            <p className="text-xs text-gray-500">~{gasEstimate[speed].time}s</p>
          </button>
        ))}
      </div>
    </div>
  );
}

