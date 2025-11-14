/**
 * Liquidity pool card component
 * @module components/liquidity/PoolCard
 */

'use client';

import { styled } from 'nativewind';
import { Card, Badge } from '../ui';
import { formatUSD, formatNumber } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';
import type { LiquidityPool } from '@/types/liquidity/pool';

interface PoolCardProps {
  pool: LiquidityPool;
  onSelect?: (pool: LiquidityPool) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onSelect }) => {
  return (
    <Card
      padding="md"
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect?.(pool)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {pool.token0.logoURI && (
              <img
                src={pool.token0.logoURI}
                alt={pool.token0.symbol}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            )}
            {pool.token1.logoURI && (
              <img
                src={pool.token1.logoURI}
                alt={pool.token1.symbol}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {pool.token0.symbol}/{pool.token1.symbol}
            </h3>
            <p className="text-sm text-gray-600">{pool.protocol}</p>
          </div>
        </div>

        <Badge variant="info">{pool.feeTier}%</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">TVL</p>
          <p className="text-lg font-semibold">{formatUSD(pool.tvl)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Volume (24h)</p>
          <p className="text-lg font-semibold">{formatUSD(pool.volume24h)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">APR</p>
          <p className="text-lg font-semibold text-green-600">
            {formatPercentage(pool.apr)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default styled(PoolCard);

