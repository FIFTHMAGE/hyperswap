'use client';

import { motion } from 'framer-motion';

interface Props {
  bids: { price: number; amount: number }[];
  asks: { price: number; amount: number }[];
}

export function MarketDepthChart({ bids, asks }: Props) {
  const maxAmount = Math.max(
    ...bids.map((b) => b.amount),
    ...asks.map((a) => a.amount)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Market Depth
      </h2>

      <div className="h-64 relative">
        <svg className="w-full h-full">
          {/* Bids (green) */}
          <path
            d={bids
              .map(
                (bid, i) =>
                  `${i === 0 ? 'M' : 'L'} ${(i / bids.length) * 50},${
                    100 - (bid.amount / maxAmount) * 100
                  }`
              )
              .join(' ')}
            fill="rgba(34, 197, 94, 0.2)"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
          />

          {/* Asks (red) */}
          <path
            d={asks
              .map(
                (ask, i) =>
                  `${i === 0 ? 'M' : 'L'} ${50 + (i / asks.length) * 50},${
                    100 - (ask.amount / maxAmount) * 100
                  }`
              )
              .join(' ')}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

