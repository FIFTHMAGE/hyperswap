/**
 * SwapInterface component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { SwapInterface } from '../SwapInterface';

const mockTokens = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balance: '2.5',
    price: 2500,
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: '5000',
    price: 1,
  },
];

const mockQuote = {
  fromAmount: '1',
  toAmount: '2475',
  rate: '2475',
  priceImpact: '0.5',
  gasEstimate: '150000',
  gasCostUsd: '12.50',
  route: ['Uniswap V3'],
};

describe('SwapInterface', () => {
  const defaultProps = {
    tokens: mockTokens,
    onSwap: vi.fn(),
    isConnected: true,
    chainId: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render swap interface', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByText(/swap/i)).toBeInTheDocument();
    });

    it('should render from token input', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByLabelText(/from|you pay/i)).toBeInTheDocument();
    });

    it('should render to token input', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByLabelText(/to|you receive/i)).toBeInTheDocument();
    });

    it('should render swap button', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
    });

    it('should render token switch button', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByRole('button', { name: /switch|reverse/i })).toBeInTheDocument();
    });
  });

  describe('token selection', () => {
    it('should open token selector for from token', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByTestId('from-token-selector'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open token selector for to token', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByTestId('to-token-selector'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should update from token when selected', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByTestId('from-token-selector'));
      await userEvent.click(screen.getByText('USDC'));

      expect(screen.getByTestId('from-token-symbol')).toHaveTextContent('USDC');
    });

    it('should not allow same token for from and to', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByTestId('from-token-selector'));
      await userEvent.click(screen.getByText('ETH'));

      await userEvent.click(screen.getByTestId('to-token-selector'));

      // ETH should not be selectable
      const ethOption = screen.queryByRole('option', { name: /ethereum/i });
      expect(ethOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('amount input', () => {
    it('should update from amount on input', async () => {
      render(<SwapInterface {...defaultProps} />);

      const input = screen.getByLabelText(/from|you pay/i);
      await userEvent.type(input, '1.5');

      expect(input).toHaveValue('1.5');
    });

    it('should set max amount on max button click', async () => {
      render(<SwapInterface {...defaultProps} />);

      // Select ETH first
      await userEvent.click(screen.getByTestId('from-token-selector'));
      await userEvent.click(screen.getByText('ETH'));

      await userEvent.click(screen.getByRole('button', { name: /max/i }));

      const input = screen.getByLabelText(/from|you pay/i);
      expect(input).toHaveValue('2.5');
    });
  });

  describe('quote display', () => {
    it('should show loading state while fetching quote', async () => {
      render(<SwapInterface {...defaultProps} />);

      // Select tokens and amount
      await userEvent.click(screen.getByTestId('from-token-selector'));
      await userEvent.click(screen.getByText('ETH'));
      await userEvent.click(screen.getByTestId('to-token-selector'));
      await userEvent.click(screen.getByText('USDC'));

      const input = screen.getByLabelText(/from|you pay/i);
      await userEvent.type(input, '1');

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should show quote after loading', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          initialQuote={mockQuote}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('2475')).toBeInTheDocument();
      });
    });

    it('should show exchange rate', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          initialQuote={mockQuote}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
        />
      );

      expect(screen.getByText(/1 ETH.*=.*2475 USDC/i)).toBeInTheDocument();
    });

    it('should show price impact', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          initialQuote={mockQuote}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
        />
      );

      expect(screen.getByText(/0\.5%/)).toBeInTheDocument();
    });
  });

  describe('token switch', () => {
    it('should switch from and to tokens', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /switch|reverse/i }));

      expect(screen.getByTestId('from-token-symbol')).toHaveTextContent('USDC');
      expect(screen.getByTestId('to-token-symbol')).toHaveTextContent('ETH');
    });

    it('should swap amounts when switching tokens', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
          toAmount="2475"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /switch|reverse/i }));

      const fromInput = screen.getByLabelText(/from|you pay/i);
      expect(fromInput).toHaveValue('2475');
    });
  });

  describe('swap execution', () => {
    it('should call onSwap when swap button clicked', async () => {
      const onSwap = vi.fn();
      render(
        <SwapInterface
          {...defaultProps}
          onSwap={onSwap}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
          initialQuote={mockQuote}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /swap/i }));

      expect(onSwap).toHaveBeenCalled();
    });

    it('should disable swap button when form invalid', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByRole('button', { name: /swap|enter.*amount/i })).toBeDisabled();
    });

    it('should disable swap when insufficient balance', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="10" // More than balance of 2.5
        />
      );

      expect(screen.getByRole('button', { name: /insufficient/i })).toBeDisabled();
    });

    it('should show confirmation modal before swap', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
          initialQuote={mockQuote}
          showConfirmation
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /swap/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/confirm.*swap/i)).toBeInTheDocument();
    });
  });

  describe('wallet connection', () => {
    it('should show connect wallet button when not connected', () => {
      render(<SwapInterface {...defaultProps} isConnected={false} />);

      expect(
        screen.getByRole('button', { name: /connect.*wallet/i })
      ).toBeInTheDocument();
    });

    it('should call onConnectWallet when connect button clicked', async () => {
      const onConnectWallet = vi.fn();
      render(
        <SwapInterface
          {...defaultProps}
          isConnected={false}
          onConnectWallet={onConnectWallet}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /connect.*wallet/i }));

      expect(onConnectWallet).toHaveBeenCalled();
    });
  });

  describe('settings', () => {
    it('should show settings button', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });

    it('should open settings panel', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: /settings/i }));

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });

    it('should update slippage setting', async () => {
      render(<SwapInterface {...defaultProps} />);

      await userEvent.click(screen.getByRole('button', { name: /settings/i }));
      await userEvent.click(screen.getByRole('button', { name: '1%' }));

      expect(screen.getByText(/1%/)).toBeInTheDocument();
    });
  });

  describe('route display', () => {
    it('should show routing info', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
          initialQuote={mockQuote}
        />
      );

      expect(screen.getByText(/uniswap/i)).toBeInTheDocument();
    });

    it('should expand route details on click', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
          fromAmount="1"
          initialQuote={{
            ...mockQuote,
            route: ['Uniswap V3', 'Curve', 'Balancer'],
          }}
        />
      );

      await userEvent.click(screen.getByText(/route/i));

      expect(screen.getByText(/curve/i)).toBeInTheDocument();
      expect(screen.getByText(/balancer/i)).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should show error message', () => {
      render(
        <SwapInterface
          {...defaultProps}
          error="Failed to fetch quote"
        />
      );

      expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument();
    });

    it('should show retry button on error', async () => {
      const onRetry = vi.fn();
      render(
        <SwapInterface
          {...defaultProps}
          error="Error"
          onRetry={onRetry}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      render(<SwapInterface {...defaultProps} loading />);

      expect(screen.getByTestId('swap-loading')).toBeInTheDocument();
    });
  });

  describe('network', () => {
    it('should show network indicator', () => {
      render(<SwapInterface {...defaultProps} chainId={1} />);

      expect(screen.getByText(/ethereum|mainnet/i)).toBeInTheDocument();
    });

    it('should show wrong network warning', () => {
      render(
        <SwapInterface
          {...defaultProps}
          chainId={1}
          requiredChainId={137}
        />
      );

      expect(screen.getByText(/wrong.*network|switch.*network/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible form', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should have labeled inputs', () => {
      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByLabelText(/from|you pay/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/to|you receive/i)).toBeInTheDocument();
    });

    it('should announce status changes', async () => {
      render(
        <SwapInterface
          {...defaultProps}
          fromToken={mockTokens[0]}
          toToken={mockTokens[1]}
        />
      );

      const input = screen.getByLabelText(/from|you pay/i);
      await userEvent.type(input, '1');

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('should render mobile layout on small screens', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<SwapInterface {...defaultProps} />);

      expect(screen.getByTestId('swap-container')).toHaveClass('mobile');
    });
  });
});

