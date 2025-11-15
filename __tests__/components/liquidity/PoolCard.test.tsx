/**
 * PoolCard component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { PoolCard } from '@/components/liquidity/PoolCard';

describe('PoolCard', () => {
  const defaultProps = {
    poolName: 'ETH/USDC',
    token0Symbol: 'ETH',
    token1Symbol: 'USDC',
    tvl: '1,500,000',
    apr: 15.5,
    volume24h: '500,000',
  };

  test('renders pool information', () => {
    render(<PoolCard {...defaultProps} />);

    expect(screen.getByText('ETH/USDC')).toBeInTheDocument();
    expect(screen.getByText('ETH/USDC')).toBeInTheDocument();
    expect(screen.getByText('15.50% APR')).toBeInTheDocument();
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<PoolCard {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByText('ETH/USDC'));
    expect(onClick).toHaveBeenCalled();
  });
});
