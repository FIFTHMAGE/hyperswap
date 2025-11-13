'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Token, SwapQuote, DEFAULT_SWAP_SETTINGS } from '@/lib/types/swap';
import { swapAggregator } from '@/lib/api/swap-aggregator';
import { Button } from '@/components/ui/Button';

export function SwapInterface() {
  const [inputToken, setInputToken] = useState<Token | null>(null);
  const [outputToken, setOutputToken] = useState<Token | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SWAP_SETTINGS);

  useEffect(() => {
    if (inputToken && outputToken && inputAmount && parseFloat(inputAmount) > 0) {
      fetchQuote();
    }
  }, [inputToken, outputToken, inputAmount]);

  const fetchQuote = async () => {
    if (!inputToken || !outputToken || !inputAmount) return;

    setLoading(true);
    try {
      const quoteData = await swapAggregator.getBestQuote(
        inputToken,
        outputToken,
        inputAmount,
        settings.slippage
      );

      if (quoteData) {
        setQuote(quoteData);
        setOutputAmount(quoteData.outputAmount);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote) return;
    // Swap execution logic would go here
    console.log('Executing swap:', quote);
  };

  const switchTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Swap
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              /* Open settings */
            }}
          >
            ⚙️
          </button>
        </div>

        {/* Input Token */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">From</span>
            {inputToken?.balance && (
              <span className="text-sm text-gray-500">
                Balance: {inputToken.balance}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none"
            />
            <button
              onClick={() => {
                /* Open token selector */
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {inputToken ? (
                <>
                  {inputToken.logoURI && (
                    <img
                      src={inputToken.logoURI}
                      alt={inputToken.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{inputToken.symbol}</span>
                </>
              ) : (
                <span className="font-semibold">Select token</span>
              )}
              <span>▼</span>
            </button>
          </div>
          {inputToken?.price && inputAmount && (
            <div className="text-sm text-gray-500 mt-2">
              ≈ ${(parseFloat(inputAmount) * inputToken.price).toFixed(2)}
            </div>
          )}
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2">
          <button
            onClick={switchTokens}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-900 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 z-10"
          >
            ⇅
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">To</span>
            {outputToken?.balance && (
              <span className="text-sm text-gray-500">
                Balance: {outputToken.balance}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none"
            />
            <button
              onClick={() => {
                /* Open token selector */
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {outputToken ? (
                <>
                  {outputToken.logoURI && (
                    <img
                      src={outputToken.logoURI}
                      alt={outputToken.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{outputToken.symbol}</span>
                </>
              ) : (
                <span className="font-semibold">Select token</span>
              )}
              <span>▼</span>
            </button>
          </div>
          {outputToken?.price && outputAmount && (
            <div className="text-sm text-gray-500 mt-2">
              ≈ ${(parseFloat(outputAmount) * outputToken.price).toFixed(2)}
            </div>
          )}
        </div>

        {/* Quote Info */}
        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                1 {inputToken?.symbol} ={' '}
                {(
                  parseFloat(quote.outputAmount) / parseFloat(quote.inputAmount)
                ).toFixed(6)}{' '}
                {outputToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Price Impact
              </span>
              <span
                className={`font-semibold ${
                  quote.priceImpact > 5
                    ? 'text-red-600'
                    : quote.priceImpact > 1
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Minimum Received
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {parseFloat(quote.minimumReceived).toFixed(6)}{' '}
                {outputToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Provider</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {quote.provider}
              </span>
            </div>
          </motion.div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!quote || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Fetching quote...' : quote ? 'Swap' : 'Enter an amount'}
        </Button>
      </div>
    </motion.div>
  );
}

