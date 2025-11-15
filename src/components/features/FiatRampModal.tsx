'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fiatRampService } from '@/lib/api/fiat-ramp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FiatRampModal({ isOpen, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [selectedProvider, setSelectedProvider] = useState('');
  
  const providers = fiatRampService.getProviders();

  const handleBuy = async () => {
    if (!selectedProvider || !amount) return;
    const url = await fiatRampService.initiatePurchase(selectedProvider, parseFloat(amount), currency);
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Buy Crypto</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Provider</label>
            <div className="space-y-2">
              {providers.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => setSelectedProvider(provider.name.toLowerCase())}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedProvider === provider.name.toLowerCase()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="font-bold">{provider.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fee: {provider.fees.percentage}% | Limit: ${provider.limits.min}-${provider.limits.max}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleBuy}
              disabled={!selectedProvider || !amount}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

