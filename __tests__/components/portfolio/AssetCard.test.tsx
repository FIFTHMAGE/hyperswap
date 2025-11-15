/**
 * AssetCard component tests
 */

import { render, screen } from '@testing-library/react';

import { AssetCard } from '@/components/portfolio/AssetCard';

describe('AssetCard', () => {
  const defaultProps = {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '1.5',
    value: '3000.00',
    priceChange24h: 5.2,
  };

  test('renders asset information', () => {
    render(<AssetCard {...defaultProps} />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('$3000.00')).toBeInTheDocument();
    expect(screen.getByText('+5.20%')).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
  });

  test('shows negative price change', () => {
    render(<AssetCard {...defaultProps} priceChange24h={-3.5} />);

    expect(screen.getByText('-3.50%')).toBeInTheDocument();
    expect(screen.getByText('-3.50%')).toHaveClass('text-red-600');
  });

  test('shows positive price change', () => {
    render(<AssetCard {...defaultProps} priceChange24h={5.2} />);

    expect(screen.getByText('+5.20%')).toBeInTheDocument();
    expect(screen.getByText('+5.20%')).toHaveClass('text-green-600');
  });
});
