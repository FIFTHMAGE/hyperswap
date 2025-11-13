/**
 * Price Alert Component
 * UI for creating and managing price alerts
 */

'use client';

import { useState } from 'react';

export interface AlertConfig {
  token: string;
  condition: 'above' | 'below';
  price: number;
}

export function PriceAlert({ onSave }: { onSave: (config: AlertConfig) => void }) {
  const [token, setToken] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token && price) {
      onSave({ token, condition, price: parseFloat(price) });
      setToken('');
      setPrice('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4">Set Price Alert</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g. SOL"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCondition('above')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                condition === 'above'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Above
            </button>
            <button
              type="button"
              onClick={() => setCondition('below')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                condition === 'below'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Below
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Target Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Create Alert
        </button>
      </div>
    </form>
  );
}

