/**
 * TokenPairSelector Component
 * Select token pairs for swapping
 */

import React, { useState, useCallback, useMemo } from 'react';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export interface TokenPairSelectorProps {
  tokens: Token[];
  fromToken: Token | null;
  toToken: Token | null;
  onFromTokenChange: (token: Token) => void;
  onToTokenChange: (token: Token) => void;
  onSwapTokens: () => void;
  popularPairs?: Array<[string, string]>;
  className?: string;
}

export const TokenPairSelector: React.FC<TokenPairSelectorProps> = ({
  tokens,
  fromToken,
  toToken,
  onFromTokenChange,
  onToTokenChange,
  onSwapTokens,
  popularPairs = [
    ['ETH', 'USDC'],
    ['ETH', 'USDT'],
    ['WBTC', 'ETH'],
    ['ETH', 'DAI'],
  ],
  className = '',
}) => {
  const [activeSelector, setActiveSelector] = useState<'from' | 'to' | null>(null);
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() => {
    if (!search) return tokens;
    const searchLower = search.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower)
    );
  }, [tokens, search]);

  const handleSelectToken = useCallback((token: Token) => {
    if (activeSelector === 'from') {
      // If selecting same as toToken, swap them
      if (toToken?.address === token.address) {
        onSwapTokens();
      } else {
        onFromTokenChange(token);
      }
    } else if (activeSelector === 'to') {
      // If selecting same as fromToken, swap them
      if (fromToken?.address === token.address) {
        onSwapTokens();
      } else {
        onToTokenChange(token);
      }
    }
    setActiveSelector(null);
    setSearch('');
  }, [activeSelector, fromToken, toToken, onFromTokenChange, onToTokenChange, onSwapTokens]);

  const handlePairSelect = useCallback((pair: [string, string]) => {
    const from = tokens.find(t => t.symbol === pair[0]);
    const to = tokens.find(t => t.symbol === pair[1]);
    if (from) onFromTokenChange(from);
    if (to) onToTokenChange(to);
  }, [tokens, onFromTokenChange, onToTokenChange]);

  const TokenButton: React.FC<{
    token: Token | null;
    type: 'from' | 'to';
    label: string;
  }> = ({ token, type, label }) => (
    <button
      onClick={() => setActiveSelector(type)}
      className="flex items-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors flex-1"
    >
      {token ? (
        <>
          {token.logoURI ? (
            <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              {token.symbol.slice(0, 2)}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-semibold text-white">{token.symbol}</p>
          </div>
        </>
      ) : (
        <div className="text-left">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-gray-300">Select token</p>
        </div>
      )}
      <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className={`${className}`}>
      {/* Popular Pairs */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Popular pairs</p>
        <div className="flex flex-wrap gap-2">
          {popularPairs.map((pair, index) => (
            <button
              key={index}
              onClick={() => handlePairSelect(pair)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
            >
              {pair[0]}/{pair[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Token Pair Selector */}
      <div className="flex items-center gap-2">
        <TokenButton token={fromToken} type="from" label="From" />
        
        <button
          onClick={onSwapTokens}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <TokenButton token={toToken} type="to" label="To" />
      </div>

      {/* Token Selection Modal */}
      {activeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Select {activeSelector === 'from' ? 'input' : 'output'} token
                </h3>
                <button
                  onClick={() => {
                    setActiveSelector(null);
                    setSearch('');
                  }}
                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or symbol"
                className="w-full px-4 py-2 bg-slate-700 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {filteredTokens.map((token) => {
                const isSelected = 
                  (activeSelector === 'from' && fromToken?.address === token.address) ||
                  (activeSelector === 'to' && toToken?.address === token.address);
                const isOtherSelected =
                  (activeSelector === 'from' && toToken?.address === token.address) ||
                  (activeSelector === 'to' && fromToken?.address === token.address);

                return (
                  <button
                    key={token.address}
                    onClick={() => handleSelectToken(token)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors ${
                      isSelected ? 'bg-blue-900/30' : ''
                    }`}
                  >
                    {token.logoURI ? (
                      <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {token.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{token.name}</p>
                    </div>
                    {token.balance && (
                      <p className="text-sm text-gray-400">{parseFloat(token.balance).toFixed(4)}</p>
                    )}
                    {isOtherSelected && (
                      <span className="text-xs text-blue-400">← swap</span>
                    )}
                    {isSelected && (
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TokenPairSelector);

