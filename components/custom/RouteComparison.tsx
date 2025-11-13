'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwapQuote } from '@/lib/types/swap';

interface Props {
  quotes: SwapQuote[];
  selectedQuote: SwapQuote;
  onSelectQuote: (quote: SwapQuote) => void;
}

export function RouteComparison({ quotes, selectedQuote, onSelectQuote }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (quotes.length <= 1) {
    return null;
  }

  const sortedQuotes = [...quotes].sort(
    (a, b) => parseFloat(b.outputAmount) - parseFloat(a.outputAmount)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔄</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {quotes.length} Routes Available
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comparing {quotes.length} aggregators
            </p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-500"
        >
          ▼
        </motion.span>
      </button>

      {/* Comparison List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-3">
              {sortedQuotes.map((quote, index) => {
                const isSelected =
                  quote.provider === selectedQuote.provider &&
                  quote.outputAmount === selectedQuote.outputAmount;
                const isBest = index === 0;
                const outputDiff =
                  ((parseFloat(quote.outputAmount) -
                    parseFloat(sortedQuotes[sortedQuotes.length - 1].outputAmount)) /
                    parseFloat(sortedQuotes[sortedQuotes.length - 1].outputAmount)) *
                  100;

                return (
                  <motion.button
                    key={`${quote.provider}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectQuote(quote)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white capitalize">
                          {quote.provider}
                        </span>
                        {isBest && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Best
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            Selected
                          </span>
                        )}
                      </div>
                      {outputDiff !== 0 && (
                        <span
                          className={`text-sm font-semibold ${
                            outputDiff >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {outputDiff >= 0 ? '+' : ''}
                          {outputDiff.toFixed(2)}%
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Output</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {parseFloat(quote.outputAmount).toFixed(6)}{' '}
                          {quote.outputToken.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Price Impact
                        </p>
                        <p
                          className={`font-semibold ${
                            quote.priceImpact > 5
                              ? 'text-red-600'
                              : quote.priceImpact > 1
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {quote.priceImpact.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Gas Est.</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {quote.estimatedGas || '~'} Gwei
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Hops</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {quote.route.length}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

