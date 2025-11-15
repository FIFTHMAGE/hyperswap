/**
 * Mobile-Optimized Swap Interface
 * Touch-friendly swap interface for mobile devices
 */

'use client';

import { useState, useRef } from 'react';
import { TouchGestureDetector } from '@/lib/mobile/touch-gestures';

interface Token {
  symbol: string;
  name: string;
  address: string;
  logoUrl?: string;
  balance?: number;
}

interface MobileSwapInterfaceProps {
  defaultFrom?: Token;
  defaultTo?: Token;
  onSwap?: (from: Token, to: Token, amount: number) => void;
}

export function MobileSwapInterface({ 
  defaultFrom,
  defaultTo,
  onSwap 
}: MobileSwapInterfaceProps) {
  const [fromToken, setFromToken] = useState<Token | null>(defaultFrom || null);
  const [toToken, setToToken] = useState<Token | null>(defaultTo || null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  
  const swapCardRef = useRef<HTMLDivElement>(null);

  // Initialize gesture detector for swipe to flip
  if (typeof window !== 'undefined' && swapCardRef.current) {
    const detector = new TouchGestureDetector(swapCardRef.current);
    detector.on('swipe', (event) => {
      if (event.direction === 'up' || event.direction === 'down') {
        handleFlipTokens();
      }
    });
  }

  const handleFlipTokens = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const temp = fromToken;
      setFromToken(toToken);
      setToToken(temp);
      
      const tempAmount = fromAmount;
      setFromAmount(toAmount);
      setToAmount(tempAmount);
      
      setIsFlipping(false);
    }, 150);
  };

  const handleSwap = () => {
    if (fromToken && toToken && fromAmount) {
      onSwap?.(fromToken, toToken, parseFloat(fromAmount));
    }
  };

  const handleMaxAmount = () => {
    if (fromToken?.balance) {
      setFromAmount(fromToken.balance.toString());
    }
  };

  const QuickSlippageButtons = () => (
    <div className="flex gap-2">
      {[0.1, 0.5, 1.0, 3.0].map((value) => (
        <button
          key={value}
          onClick={() => setSlippage(value)}
          className={`
            flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
            ${slippage === value 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }
          `}
        >
          {value}%
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Swap</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-white rounded-full shadow-md active:scale-95 transition-transform"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="font-semibold mb-3">Swap Settings</h3>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Slippage Tolerance</span>
              <span className="text-sm font-medium">{slippage}%</span>
            </div>
            <QuickSlippageButtons />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Auto Router</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Expert Mode</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      )}

      {/* Swap Card */}
      <div ref={swapCardRef} className="relative">
        {/* From Token */}
        <div className={`bg-white rounded-2xl p-4 shadow-lg mb-2 transition-transform ${isFlipping ? 'scale-95' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">From</span>
            {fromToken?.balance && (
              <span className="text-xs text-gray-500">
                Balance: {fromToken.balance.toFixed(4)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 active:scale-95 transition-transform">
              {fromToken ? (
                <>
                  {fromToken.logoUrl && (
                    <img src={fromToken.logoUrl} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-semibold">{fromToken.symbol}</span>
                </>
              ) : (
                <span className="text-gray-500">Select token</span>
              )}
              <span className="text-gray-400">▼</span>
            </button>
            
            <div className="flex-1 relative">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-right text-2xl font-bold bg-transparent border-none outline-none"
              />
              {fromToken?.balance && (
                <button
                  onClick={handleMaxAmount}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-medium px-2 py-1 bg-blue-50 rounded active:scale-95 transition-transform"
                >
                  MAX
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleFlipTokens}
            className="p-3 bg-blue-500 rounded-full shadow-lg text-white active:scale-90 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div className={`bg-white rounded-2xl p-4 shadow-lg mb-4 transition-transform ${isFlipping ? 'scale-95' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">To (estimated)</span>
            {toToken?.balance && (
              <span className="text-xs text-gray-500">
                Balance: {toToken.balance.toFixed(4)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 active:scale-95 transition-transform">
              {toToken ? (
                <>
                  {toToken.logoUrl && (
                    <img src={toToken.logoUrl} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-semibold">{toToken.symbol}</span>
                </>
              ) : (
                <span className="text-gray-500">Select token</span>
              )}
              <span className="text-gray-400">▼</span>
            </button>
            
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 text-right text-2xl font-bold bg-transparent border-none outline-none text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Swap Info */}
      {fromAmount && toAmount && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rate</span>
            <span className="font-medium">
              1 {fromToken?.symbol} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken?.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price Impact</span>
            <span className="font-medium text-green-600">{'<'}0.01%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min. Received</span>
            <span className="font-medium">
              {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken?.symbol}
            </span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!fromToken || !toToken || !fromAmount}
        className="
          w-full py-4 rounded-2xl font-bold text-lg
          bg-gradient-to-r from-blue-500 to-purple-500 text-white
          disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500
          active:scale-98 transition-all shadow-lg
          disabled:cursor-not-allowed
        "
      >
        {!fromToken || !toToken ? 'Select Tokens' : !fromAmount ? 'Enter Amount' : 'Swap'}
      </button>

      {/* Swipe hint */}
      <div className="text-center text-xs text-gray-400 mt-4">
        💡 Swipe up/down to flip tokens
      </div>
    </div>
  );
}

