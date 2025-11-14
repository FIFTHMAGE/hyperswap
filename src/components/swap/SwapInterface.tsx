/**
 * Main Swap Interface component
 * @module components/swap/SwapInterface
 */

'use client';

import { useState } from 'react';
import { styled } from 'nativewind';
import { Card } from '../ui';
import TokenInput from './TokenInput';
import SwapButton from './SwapButton';
import SwapSettings from './SwapSettings';
import { useSwapQuote } from '@/hooks/domain/useSwapQuote';
import { useWallet } from '@/hooks/core/useWallet';

const SwapInterface: React.FC = () => {
  const { wallet, chainId } = useWallet();
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.005);
  const [showSettings, setShowSettings] = useState(false);

  const { quote, loading } = useSwapQuote({
    chainId,
    fromToken,
    toToken,
    amount: fromAmount,
    slippage,
    enabled: Boolean(fromToken && toToken && fromAmount),
  });

  const handleSwap = async () => {
    // Swap execution logic will be implemented
    console.log('Executing swap...', { fromToken, toToken, fromAmount, quote });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Swap</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>

        <div className="space-y-2">
          <TokenInput
            label="From"
            value={fromAmount}
            onChange={setFromAmount}
            token={fromToken}
            onTokenSelect={setFromToken}
            balance="0"
          />

          <div className="flex justify-center -my-2 relative z-10">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              ↓
            </button>
          </div>

          <TokenInput
            label="To"
            value={quote?.toAmount || ''}
            onChange={() => {}}
            token={toToken}
            onTokenSelect={setToToken}
            balance="0"
            readOnly
          />
        </div>

        {quote && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Price Impact</span>
              <span>{(quote.priceImpact * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Gas</span>
              <span>{quote.estimatedGas}</span>
            </div>
          </div>
        )}

        <SwapButton
          onClick={handleSwap}
          disabled={!wallet || !fromToken || !toToken || !fromAmount || loading}
          isLoading={loading}
        />
      </Card>

      {showSettings && (
        <SwapSettings
          slippage={slippage}
          onSlippageChange={setSlippage}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default styled(SwapInterface);

