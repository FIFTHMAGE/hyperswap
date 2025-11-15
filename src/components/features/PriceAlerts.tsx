'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { Token } from '@/lib/types/swap';

interface Props {
  token?: Token;
}

export function PriceAlerts({ token }: Props) {
  const { alerts, createAlert, deleteAlert, toggleAlert } = usePriceAlerts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertType, setAlertType] = useState<'above' | 'below' | 'percent_change'>('above');
  const [targetValue, setTargetValue] = useState('');

  const handleCreateAlert = () => {
    if (!token || !targetValue) return;

    const numValue = parseFloat(targetValue);
    if (isNaN(numValue)) return;

    createAlert({
      tokenAddress: token.address,
      tokenSymbol: token.symbol,
      tokenName: token.name,
      chainId: token.chainId,
      type: alertType,
      targetPrice: alertType !== 'percent_change' ? numValue : undefined,
      percentChange: alertType === 'percent_change' ? numValue : undefined,
      currentPrice: token.price || 0,
      isActive: true,
      notificationMethod: ['browser'],
    });

    setShowCreateForm(false);
    setTargetValue('');
  };

  const tokenAlerts = token
    ? alerts.filter((alert) => alert.tokenAddress === token.address)
    : alerts;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Price Alerts
        </h2>
        {token && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            + Create Alert
          </button>
        )}
      </div>

      {/* Create Alert Form */}
      <AnimatePresence>
        {showCreateForm && token && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Alert for {token.symbol}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Alert Type
                </label>
                <div className="flex gap-2">
                  {(['above', 'below', 'percent_change'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setAlertType(type)}
                      className={`flex-1 py-2 rounded-lg font-semibold capitalize transition-colors ${
                        alertType === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {alertType === 'percent_change' ? 'Percent Change' : 'Target Price'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={alertType === 'percent_change' ? '10' : '100.00'}
                    step={alertType === 'percent_change' ? '1' : '0.01'}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {alertType === 'percent_change' ? '%' : '$'}
                  </span>
                </div>
                {token.price && alertType !== 'percent_change' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Current price: ${token.price.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateAlert}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-4">
        {tokenAlerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No alerts created yet</p>
          </div>
        ) : (
          tokenAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                alert.triggered ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {alert.tokenSymbol}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.triggered
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : alert.isActive
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {alert.triggered ? 'TRIGGERED' : alert.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {alert.type === 'above' && `Alert when price goes above $${alert.targetPrice}`}
                    {alert.type === 'below' && `Alert when price goes below $${alert.targetPrice}`}
                    {alert.type === 'percent_change' &&
                      `Alert on ${alert.percentChange}% change`}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Created {new Date(alert.createdAt).toLocaleDateString()}
                    {alert.triggeredAt &&
                      ` • Triggered ${new Date(alert.triggeredAt).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!alert.triggered && (
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        alert.isActive
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {alert.isActive ? 'Pause' : 'Resume'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

