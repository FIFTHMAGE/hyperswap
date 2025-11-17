/**
 * Pool list component with loading states
 * @module components/liquidity/PoolList
 */

'use client';

import { styled } from 'nativewind';

import type { LiquidityPool } from '@/types/liquidity/pool';

import { Spinner, Card } from '../ui';

import PoolCard from './PoolCard';

interface PoolListProps {
  pools: LiquidityPool[];
  loading?: boolean;
  onSelectPool?: (pool: LiquidityPool) => void;
}

const PoolList: React.FC<PoolListProps> = ({ pools, loading = false, onSelectPool }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No pools found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pools.map((pool) => (
        <PoolCard key={`${pool.chainId}-${pool.address}`} pool={pool} onSelect={onSelectPool} />
      ))}
    </div>
  );
};

export default styled(PoolList);
