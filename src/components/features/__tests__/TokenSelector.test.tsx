/**
 * TokenSelector component tests
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { TokenSelector } from '../TokenSelector';

const mockTokens = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: '/tokens/eth.png',
    balance: '1.5',
    price: 2500,
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/tokens/usdc.png',
    balance: '1000',
    price: 1,
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: '/tokens/dai.png',
    balance: '500',
    price: 1,
  },
  {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: '/tokens/wbtc.png',
    balance: '0.05',
    price: 45000,
  },
];

describe('TokenSelector', () => {
  const defaultProps = {
    tokens: mockTokens,
    selectedToken: null,
    onSelectToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render token selector button', () => {
      render(<TokenSelector {...defaultProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show "Select token" when no token selected', () => {
      render(<TokenSelector {...defaultProps} />);

      expect(screen.getByText(/select.*token/i)).toBeInTheDocument();
    });

    it('should show selected token', () => {
      render(
        <TokenSelector {...defaultProps} selectedToken={mockTokens[0]} />
      );

      expect(screen.getByText('ETH')).toBeInTheDocument();
    });

    it('should show token logo', () => {
      render(
        <TokenSelector {...defaultProps} selectedToken={mockTokens[0]} />
      );

      expect(screen.getByAltText('ETH')).toBeInTheDocument();
    });
  });

  describe('modal/dropdown', () => {
    it('should open modal on click', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show all tokens in modal', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText('ETH')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
      expect(screen.getByText('DAI')).toBeInTheDocument();
      expect(screen.getByText('WBTC')).toBeInTheDocument();
    });

    it('should close modal on token selection', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('USDC'));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close modal on close button click', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close modal on Escape key', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('selection', () => {
    it('should call onSelectToken when token clicked', async () => {
      const onSelectToken = vi.fn();
      render(<TokenSelector {...defaultProps} onSelectToken={onSelectToken} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('USDC'));

      expect(onSelectToken).toHaveBeenCalledWith(mockTokens[1]);
    });

    it('should highlight currently selected token', async () => {
      render(
        <TokenSelector {...defaultProps} selectedToken={mockTokens[0]} />
      );

      await userEvent.click(screen.getByRole('button'));

      const ethOption = screen.getByRole('option', { name: /eth/i });
      expect(ethOption).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('search', () => {
    it('should show search input in modal', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should filter tokens by symbol', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'ETH');

      expect(screen.getByText('ETH')).toBeInTheDocument();
      expect(screen.queryByText('USDC')).not.toBeInTheDocument();
    });

    it('should filter tokens by name', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'Bitcoin');

      expect(screen.getByText('WBTC')).toBeInTheDocument();
      expect(screen.queryByText('ETH')).not.toBeInTheDocument();
    });

    it('should filter tokens by address', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), '0xa0b8');

      expect(screen.getByText('USDC')).toBeInTheDocument();
      expect(screen.queryByText('ETH')).not.toBeInTheDocument();
    });

    it('should show no results message', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'xyz123');

      expect(screen.getByText(/no.*tokens.*found/i)).toBeInTheDocument();
    });

    it('should clear search on close and reopen', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'ETH');
      await userEvent.keyboard('{Escape}');
      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('searchbox')).toHaveValue('');
    });
  });

  describe('token info', () => {
    it('should show token balance', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText('1.5')).toBeInTheDocument(); // ETH balance
    });

    it('should show token USD value', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText(/\$3,750/)).toBeInTheDocument(); // 1.5 ETH * $2500
    });

    it('should show token name and symbol', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('ETH')).toBeInTheDocument();
    });
  });

  describe('popular tokens', () => {
    it('should show popular tokens section', async () => {
      render(<TokenSelector {...defaultProps} showPopular />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText(/popular/i)).toBeInTheDocument();
    });

    it('should allow quick selection from popular tokens', async () => {
      const onSelectToken = vi.fn();
      render(
        <TokenSelector
          {...defaultProps}
          onSelectToken={onSelectToken}
          showPopular
          popularTokens={['ETH', 'USDC']}
        />
      );

      await userEvent.click(screen.getByRole('button'));
      
      // Click on quick select button
      const popularButton = screen.getAllByText('ETH')[0];
      await userEvent.click(popularButton);

      expect(onSelectToken).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<TokenSelector {...defaultProps} disabled />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not open modal when disabled', async () => {
      render(<TokenSelector {...defaultProps} disabled />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      render(<TokenSelector {...defaultProps} loading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('exclude tokens', () => {
    it('should exclude specified tokens', async () => {
      render(
        <TokenSelector
          {...defaultProps}
          excludeTokens={[mockTokens[0].address]}
        />
      );

      await userEvent.click(screen.getByRole('button'));

      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });
  });

  describe('custom token import', () => {
    it('should show import token section when address entered', async () => {
      render(<TokenSelector {...defaultProps} allowCustom />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(
        screen.getByRole('searchbox'),
        '0x1234567890123456789012345678901234567890'
      );

      expect(screen.getByText(/import.*token/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button', () => {
      render(<TokenSelector {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveAccessibleName();
    });

    it('should have listbox role for token list', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<TokenSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(defaultProps.onSelectToken).toHaveBeenCalled();
    });
  });
});

