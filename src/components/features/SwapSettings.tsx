'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwapSettings } from '@/hooks/useSwapSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SwapSettings({ isOpen, onClose }: Props) {
  const {
    settings,
    updateSlippage,
    updateDeadline,
    toggleAutoRouting,
    toggleExpertMode,
    toggleMultihops,
    updateGasPrice,
    resetToDefaults,
  } = useSwapSettings();

  const [customSlippage, setCustomSlippage] = useState<string>(
    settings.slippage.toString()
  );
  const [customDeadline, setCustomDeadline] = useState<string>(
    settings.deadline.toString()
  );
  const [customGasPrice, setCustomGasPrice] = useState<string>(
    settings.gasPrice || ''
  );

  const presetSlippages = [0.1, 0.5, 1.0];

  const handleSlippageChange = (value: number) => {
    setCustomSlippage(value.toString());
    updateSlippage(value);
  };

  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      updateSlippage(numValue);
    }
  };

  const handleDeadlineChange = (value: string) => {
    setCustomDeadline(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateDeadline(numValue);
    }
  };

  const handleGasPriceChange = (value: string) => {
    setCustomGasPrice(value);
    updateGasPrice(value || undefined);
  };

  const getSlippageWarning = (): string | null => {
    const slippage = parseFloat(customSlippage);
    if (isNaN(slippage)) return null;
    if (slippage < 0.1) return 'Your transaction may fail';
    if (slippage > 5) return 'Your transaction may be frontrun';
    return null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transaction Settings
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Slippage Tolerance */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Slippage Tolerance
                </label>
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Reset
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                {presetSlippages.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSlippageChange(preset)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      settings.slippage === preset
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
                <div className="flex-1">
                  <input
                    type="number"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
                    placeholder="Custom"
                    step="0.1"
                    min="0"
                    max="50"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {getSlippageWarning() && (
                <div className="text-sm text-yellow-600 dark:text-yellow-500">
                  ⚠️ {getSlippageWarning()}
                </div>
              )}
            </div>

            {/* Transaction Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Transaction Deadline
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={customDeadline}
                  onChange={(e) => handleDeadlineChange(e.target.value)}
                  min="1"
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 dark:text-gray-400">minutes</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Your transaction will revert if it is pending for more than this duration
              </p>
            </div>

            {/* Gas Price (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Gas Price (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={customGasPrice}
                  onChange={(e) => handleGasPriceChange(e.target.value)}
                  placeholder="Auto"
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 dark:text-gray-400">GWEI</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Leave empty for automatic gas price
              </p>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Auto Router
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically find the best route
                  </p>
                </div>
                <button
                  onClick={toggleAutoRouting}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoRouting ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      settings.autoRouting ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Disable Multihops
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Restrict to direct swaps only
                  </p>
                </div>
                <button
                  onClick={toggleMultihops}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.disableMultihops ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      settings.disableMultihops ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Expert Mode
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      RISKY
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bypass confirmation modals and allow high slippage
                  </p>
                </div>
                <button
                  onClick={toggleExpertMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.expertMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      settings.expertMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {settings.expertMode && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                  ⚠️ Expert Mode Warning
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Expert mode turns off transaction confirmations and allows high slippage trades.
                  Use at your own risk.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

