/**
 * Pool filtering component
 * @module components/liquidity/PoolFilters
 */

'use client';

import { styled } from 'nativewind';
import { Card, SearchInput, Input } from '../ui';

interface PoolFiltersProps {
  sortBy: 'tvl' | 'volume' | 'apr';
  onSortChange: (sort: 'tvl' | 'volume' | 'apr') => void;
  minLiquidity: number;
  onMinLiquidityChange: (value: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PoolFilters: React.FC<PoolFiltersProps> = ({
  sortBy,
  onSortChange,
  minLiquidity,
  onMinLiquidityChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Card padding="md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <SearchInput
            placeholder="Search pools..."
            onSearch={onSearchChange}
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tvl">Total Value Locked</option>
            <option value="volume">24h Volume</option>
            <option value="apr">APR</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Liquidity</label>
          <Input
            type="number"
            value={minLiquidity}
            onChange={(e) => onMinLiquidityChange(Number(e.target.value))}
            placeholder="100000"
            fullWidth
          />
        </div>
      </div>
    </Card>
  );
};

export default styled(PoolFilters);

