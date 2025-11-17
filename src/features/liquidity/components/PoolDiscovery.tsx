/**
 * Pool discovery and exploration component
 * @module components/liquidity/PoolDiscovery
 */

'use client';

import { styled } from 'nativewind';
import { useState } from 'react';

import { useChainId } from '@/hooks/core/useChainId';
import { useLiquidityPools } from '@/hooks/domain/useLiquidityPools';

import PoolFilters from './PoolFilters';
import PoolList from './PoolList';

const PoolDiscovery: React.FC = () => {
  const { chainId } = useChainId();
  const [sortBy, setSortBy] = useState<'tvl' | 'volume' | 'apr'>('tvl');
  const [minLiquidity, setMinLiquidity] = useState(100000);
  const [searchQuery, setSearchQuery] = useState('');

  const { pools, loading, refresh } = useLiquidityPools({
    chainId,
    sortBy,
    minLiquidity,
    searchQuery,
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liquidity Pools</h1>
        <button onClick={refresh} className="px-4 py-2 text-blue-600 hover:text-blue-700">
          Refresh
        </button>
      </div>

      <PoolFilters
        sortBy={sortBy}
        onSortChange={setSortBy}
        minLiquidity={minLiquidity}
        onMinLiquidityChange={setMinLiquidity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <PoolList pools={pools} loading={loading} />
    </div>
  );
};

export default styled(PoolDiscovery);
