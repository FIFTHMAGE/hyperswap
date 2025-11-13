'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLimitOrders } from '@/hooks/useLimitOrders';
import { Token } from '@/lib/types/swap';

interface Props {
  inputToken?: Token;
  outputToken?: Token;
  userAddress?: string;
}

export function LimitOrderPanel({ inputToken, outputToken, userAddress }: Props) {
  const { orders, activeOrders, createOrder, cancelOrder } = useLimitOrders(userAddress);
  const [inputAmount, setInputAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');

  const handleCreateOrder = () => {
    if (!inputToken || !outputToken || !userAddress || !inputAmount || !limitPrice) return;

    createOrder({
      userAddress,
      inputToken: {
        address: inputToken.address,
        symbol: inputToken.symbol,
        amount: inputAmount,
        decimals: inputToken.decimals,
      },
      outputToken: {
        address: outputToken.address,
        symbol: outputToken.symbol,
        minAmount: (parseFloat(inputAmount) * parseFloat(limitPrice)).toString(),
        decimals: outputToken.decimals,
      },
      limitPrice: parseFloat(limitPrice),
      currentPrice: inputToken.price || 0,
      expiryTime: Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000,
      chainId: inputToken.chainId,
    });

    setInputAmount('');
    setLimitPrice('');
  };

  return (
    <div className="space-y-6">
      {/* Create Order Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Create Limit Order
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Limit Price</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Expiry (days)</label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
          <button
            onClick={handleCreateOrder}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Place Limit Order
          </button>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Active Orders ({activeOrders.length})</h3>
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="font-semibold">
                  {order.inputToken.symbol} → {order.outputToken.symbol}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: {order.inputToken.amount} @ ${order.limitPrice}
                </p>
              </div>
              <button
                onClick={() => cancelOrder(order.id)}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

