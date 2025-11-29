/**
 * SwapInterface Component
 * Main swap interface for token exchanges
 */

import React, { useState, useCallback } from 'react';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export interface SwapInterfaceProps {
  tokens: Token[];
  onSwap: (params: {
    fromToken: Token;
    toToken: Token;
    fromAmount: string;
    toAmount: string;
    slippage: number;
  }) => Promise<void>;
  onTokenSelect?: (token: Token, isFrom: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({
  tokens,
  onSwap,
  onTokenSelect,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const [fromToken, setFromToken] = useState<Token | null>(tokens[0] || null);
  const [toToken, setToToken] = useState<Token | null>(tokens[1] || null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  const handleSwapTokens = useCallback(() => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  }, [fromToken, toToken, fromAmount, toAmount]);

  const handleFromAmountChange = useCallback((value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
      // Mock conversion - in real app would fetch quote
      if (value && parseFloat(value) > 0) {
        setToAmount((parseFloat(value) * 0.98).toFixed(6));
      } else {
        setToAmount('');
      }
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount) return;
    
    await onSwap({
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      slippage,
    });
  }, [fromToken, toToken, fromAmount, toAmount, slippage, onSwap]);

  const selectFromToken = useCallback((token: Token) => {
    setFromToken(token);
    onTokenSelect?.(token, true);
  }, [onTokenSelect]);

  const selectToToken = useCallback((token: Token) => {
    setToToken(token);
    onTokenSelect?.(token, false);
  }, [onTokenSelect]);

  return (
    <div className={`bg-slate-900 rounded-3xl p-6 max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">Slippage Tolerance</p>
          <div className="flex gap-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  slippage === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
              >
                {value}%
              </button>
            ))}
            <input
              type="text"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
              className="w-16 px-2 py-1 bg-slate-700 rounded-lg text-white text-sm text-center"
            />
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-2">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">You pay</span>
          {fromToken?.balance && (
            <span className="text-sm text-gray-400">
              Balance: {parseFloat(fromToken.balance).toFixed(4)}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-2xl font-medium text-white outline-none"
          />
          <select
            value={fromToken?.address || ''}
            onChange={(e) => {
              const token = tokens.find(t => t.address === e.target.value);
              if (token) selectFromToken(token);
            }}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl font-medium"
          >
            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={handleSwapTokens}
          className="bg-slate-800 border-4 border-slate-900 rounded-xl p-2 hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* To Token */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">You receive</span>
          {toToken?.balance && (
            <span className="text-sm text-gray-400">
              Balance: {parseFloat(toToken.balance).toFixed(4)}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="flex-1 bg-transparent text-2xl font-medium text-white outline-none"
          />
          <select
            value={toToken?.address || ''}
            onChange={(e) => {
              const token = tokens.find(t => t.address === e.target.value);
              if (token) selectToToken(token);
            }}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl font-medium"
          >
            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Info */}
      {fromToken && toToken && fromAmount && (
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Rate</span>
            <span>1 {fromToken.symbol} = 0.98 {toToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Price Impact</span>
            <span className="text-green-400">&lt; 0.01%</span>
          </div>
          <div className="flex justify-between">
            <span>Min. Received</span>
            <span>{(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken.symbol}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || isLoading || !fromAmount || !fromToken || !toToken}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          disabled || isLoading || !fromAmount
            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Swapping...
          </span>
        ) : !fromAmount ? (
          'Enter an amount'
        ) : (
          'Swap'
        )}
      </button>
    </div>
  );
};

export default React.memo(SwapInterface);

