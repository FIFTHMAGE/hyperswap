'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { bridgeService, BridgeQuote } from '@/lib/api/bridge-service';

export function BridgeInterface() {
  const [sourceChain, setSourceChain] = useState(1);
  const [destChain, setDestChain] = useState(137);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<BridgeQuote | null>(null);

  const chains = [
    { id: 1, name: 'Ethereum' },
    { id: 137, name: 'Polygon' },
    { id: 42161, name: 'Arbitrum' },
    { id: 10, name: 'Optimism' },
  ];

  const fetchQuote = async () => {
    if (!amount) return;
    const q = await bridgeService.getBridgeQuote(sourceChain, destChain, '', amount);
    setQuote(q);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Cross-Chain Bridge</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">From Chain</label>
          <select
            value={sourceChain}
            onChange={(e) => setSourceChain(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>{chain.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">To Chain</label>
          <select
            value={destChain}
            onChange={(e) => setDestChain(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>{chain.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          />
        </div>

        <button
          onClick={fetchQuote}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Get Bridge Quote
        </button>

        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2"
          >
            <div className="flex justify-between">
              <span>You'll receive</span>
              <span className="font-bold">{quote.outputAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fee</span>
              <span>{quote.fee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Est. Time</span>
              <span>{quote.estimatedTime}s</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

