/**
 * Token balances list component
 * @module components/portfolio/TokenBalances
 */

'use client';

import { styled } from 'nativewind';
import { Card, SearchInput, Badge } from '../ui';
import { useState } from 'react';
import { useTokenBalances } from '@/hooks/domain/useTokenBalances';
import { useWallet } from '@/hooks/core/useWallet';
import { formatUSD, formatTokenAmount } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';

const TokenBalances: React.FC = () => {
  const { wallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const { balances, loading } = useTokenBalances(wallet?.address || '');

  const filteredBalances = balances.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Token Balances</h3>
        <SearchInput
          placeholder="Search tokens..."
          onSearch={setSearchQuery}
          className="w-64"
        />
      </div>

      <div className="space-y-2">
        {filteredBalances.map((token) => (
          <div
            key={`${token.chainId}-${token.address}`}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <Badge variant="default" size="sm">{token.chainName}</Badge>
                </div>
                <p className="text-sm text-gray-600">{token.name}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">{formatTokenAmount(token.balance, token.decimals)}</p>
              <p className="text-sm text-gray-600">{formatUSD(token.balanceUSD)}</p>
              {token.priceChange24h !== undefined && (
                <p className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{formatPercentage(token.priceChange24h)}
                </p>
              )}
            </div>
          </div>
        ))}

        {filteredBalances.length === 0 && (
          <p className="text-center py-8 text-gray-500">No tokens found</p>
        )}
      </div>
    </Card>
  );
};

export default styled(TokenBalances);

