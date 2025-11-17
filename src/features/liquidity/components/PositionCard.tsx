/**
 * LP position card component
 * @module components/liquidity/PositionCard
 */

'use client';

import { styled } from 'nativewind';

import type { PoolPosition } from '@/types/liquidity/position';
import { formatUSD } from '@/utils/format/currency';
import { formatPercentage } from '@/utils/format/percentage';

import { Card, Badge } from '../ui';

interface PositionCardProps {
  position: PoolPosition;
  onManage?: (position: PoolPosition) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, onManage }) => {
  const isProfitable = position.pnl >= 0;

  return (
    <Card padding="md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {position.token0Symbol}/{position.token1Symbol}
          </h3>
          <p className="text-sm text-gray-600">{position.protocol}</p>
        </div>
        <Badge variant={position.status === 'active' ? 'success' : 'default'}>
          {position.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Liquidity</span>
          <span className="font-semibold">{formatUSD(position.liquidityUSD)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Fees Earned</span>
          <span className="font-semibold text-green-600">{formatUSD(position.feesEarned)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">P&L</span>
          <span className={`font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}
            {formatUSD(position.pnl)} ({formatPercentage(position.pnlPercent)})
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">IL</span>
          <span className="font-semibold text-red-600">{formatUSD(position.impermanentLoss)}</span>
        </div>
      </div>

      {onManage && (
        <button
          onClick={() => onManage(position)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Manage Position
        </button>
      )}
    </Card>
  );
};

export default styled(PositionCard);
