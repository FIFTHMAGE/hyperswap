'use client';

import { useState } from 'react';
import { MEVProtection } from '@/lib/utils/mev-protection';

interface Props {
  slippage: number;
  amount: number;
}

export function MEVProtectionToggle({ slippage, amount }: Props) {
  const [enabled, setEnabled] = useState(true);
  const risk = MEVProtection.calculateMEVRisk(slippage, amount);

  const riskColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div>
        <p className="font-semibold">MEV Protection</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Risk: <span className={riskColors[risk]}>{risk.toUpperCase()}</span>
        </p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

