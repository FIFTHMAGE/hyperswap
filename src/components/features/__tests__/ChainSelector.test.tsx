/**
 * ChainSelector component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ChainSelector } from '../ChainSelector';

const mockChains = [
  {
    id: 1,
    name: 'Ethereum',
    icon: '/chains/eth.png',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.infura.io',
    blockExplorer: 'https://etherscan.io',
  },
  {
    id: 137,
    name: 'Polygon',
    icon: '/chains/polygon.png',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    icon: '/chains/arbitrum.png',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
  },
  {
    id: 10,
    name: 'Optimism',
    icon: '/chains/optimism.png',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
];

describe('ChainSelector', () => {
  const defaultProps = {
    chains: mockChains,
    selectedChainId: 1,
    onChainChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render chain selector button', () => {
      render(<ChainSelector {...defaultProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show selected chain name', () => {
      render(<ChainSelector {...defaultProps} />);

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should show selected chain icon', () => {
      render(<ChainSelector {...defaultProps} />);

      expect(screen.getByAltText('Ethereum')).toBeInTheDocument();
    });

    it('should show chain ID in badge', () => {
      render(<ChainSelector {...defaultProps} showChainId />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('should open dropdown on click', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should show all chains in dropdown', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.getByText('Arbitrum')).toBeInTheDocument();
      expect(screen.getByText('Optimism')).toBeInTheDocument();
    });

    it('should close dropdown on chain selection', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('Polygon'));

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should close dropdown on click outside', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should close dropdown on Escape key', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('chain selection', () => {
    it('should call onChainChange when chain selected', async () => {
      const onChainChange = vi.fn();
      render(<ChainSelector {...defaultProps} onChainChange={onChainChange} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('Polygon'));

      expect(onChainChange).toHaveBeenCalledWith(137);
    });

    it('should highlight currently selected chain', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      const ethOption = screen.getByRole('option', { name: /ethereum/i });
      expect(ethOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should show checkmark on selected chain', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      const ethOption = screen.getByRole('option', { name: /ethereum/i });
      expect(ethOption.querySelector('[data-testid="check-icon"]')).toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('should show search input in dropdown', async () => {
      render(<ChainSelector {...defaultProps} searchable />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should filter chains by name', async () => {
      render(<ChainSelector {...defaultProps} searchable />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'poly');

      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });

    it('should show no results message', async () => {
      render(<ChainSelector {...defaultProps} searchable />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('searchbox'), 'xyz');

      expect(screen.getByText(/no.*chains.*found/i)).toBeInTheDocument();
    });
  });

  describe('chain groups', () => {
    it('should group chains by category', async () => {
      render(
        <ChainSelector
          {...defaultProps}
          groupBy="category"
          chainCategories={{
            mainnet: [1],
            l2: [137, 42161, 10],
          }}
        />
      );

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByText(/mainnet/i)).toBeInTheDocument();
      expect(screen.getByText(/l2|layer 2/i)).toBeInTheDocument();
    });
  });

  describe('disabled chains', () => {
    it('should disable specific chains', async () => {
      render(
        <ChainSelector
          {...defaultProps}
          disabledChainIds={[137]}
        />
      );

      await userEvent.click(screen.getByRole('button'));

      const polygonOption = screen.getByRole('option', { name: /polygon/i });
      expect(polygonOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not select disabled chain', async () => {
      const onChainChange = vi.fn();
      render(
        <ChainSelector
          {...defaultProps}
          onChainChange={onChainChange}
          disabledChainIds={[137]}
        />
      );

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('Polygon'));

      expect(onChainChange).not.toHaveBeenCalledWith(137);
    });

    it('should show tooltip on disabled chain', async () => {
      render(
        <ChainSelector
          {...defaultProps}
          disabledChainIds={[137]}
          disabledReason="Coming soon"
        />
      );

      await userEvent.click(screen.getByRole('button'));
      await userEvent.hover(screen.getByText('Polygon'));

      expect(screen.getByRole('tooltip')).toHaveTextContent('Coming soon');
    });
  });

  describe('network status', () => {
    it('should show network status indicator', async () => {
      render(
        <ChainSelector
          {...defaultProps}
          showNetworkStatus
          networkStatuses={{ 1: 'healthy', 137: 'degraded' }}
        />
      );

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('status-1')).toHaveClass('bg-green-500');
      expect(screen.getByTestId('status-137')).toHaveClass('bg-yellow-500');
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      render(<ChainSelector {...defaultProps} loading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<ChainSelector {...defaultProps} disabled />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not open dropdown when disabled', async () => {
      render(<ChainSelector {...defaultProps} disabled />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate with arrow keys', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { name: /polygon/i })).toHaveClass('highlighted');
    });

    it('should select with Enter key', async () => {
      const onChainChange = vi.fn();
      render(<ChainSelector {...defaultProps} onChainChange={onChainChange} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{ArrowDown}{Enter}');

      expect(onChainChange).toHaveBeenCalledWith(137);
    });
  });

  describe('variants', () => {
    it('should render compact variant', () => {
      render(<ChainSelector {...defaultProps} variant="compact" />);

      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
      expect(screen.getByAltText('Ethereum')).toBeInTheDocument();
    });

    it('should render full variant', () => {
      render(<ChainSelector {...defaultProps} variant="full" />);

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText(/mainnet/i)).toBeInTheDocument();
    });
  });

  describe('custom chains', () => {
    it('should show add custom chain button', async () => {
      render(<ChainSelector {...defaultProps} allowCustom />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('button', { name: /add.*chain/i })).toBeInTheDocument();
    });

    it('should open add chain modal', async () => {
      render(<ChainSelector {...defaultProps} allowCustom />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('button', { name: /add.*chain/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('testnet toggle', () => {
    it('should show testnet toggle', async () => {
      render(<ChainSelector {...defaultProps} showTestnets />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('switch', { name: /testnet/i })).toBeInTheDocument();
    });

    it('should show testnets when enabled', async () => {
      const chainsWithTestnet = [
        ...mockChains,
        { id: 5, name: 'Goerli', icon: '/chains/goerli.png', testnet: true },
      ];

      render(
        <ChainSelector
          {...defaultProps}
          chains={chainsWithTestnet}
          showTestnets
        />
      );

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('switch', { name: /testnet/i }));

      expect(screen.getByText('Goerli')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button', () => {
      render(<ChainSelector {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveAccessibleName();
    });

    it('should have accessible listbox', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('listbox')).toHaveAccessibleName();
    });

    it('should announce selection changes', async () => {
      render(<ChainSelector {...defaultProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText('Polygon'));

      expect(screen.getByRole('status')).toHaveTextContent(/polygon/i);
    });
  });
});

