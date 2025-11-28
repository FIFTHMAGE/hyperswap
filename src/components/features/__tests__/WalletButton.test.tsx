/**
 * WalletButton component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { WalletButton } from '../WalletButton';

describe('WalletButton', () => {
  const defaultProps = {
    isConnected: false,
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
  };

  const connectedProps = {
    ...defaultProps,
    isConnected: true,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '2.5',
    balanceSymbol: 'ETH',
    ensName: 'vitalik.eth',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('disconnected state', () => {
    it('should render connect button when disconnected', () => {
      render(<WalletButton {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /connect.*wallet/i })
      ).toBeInTheDocument();
    });

    it('should call onConnect when connect button clicked', async () => {
      const onConnect = vi.fn();
      render(<WalletButton {...defaultProps} onConnect={onConnect} />);

      await userEvent.click(screen.getByRole('button', { name: /connect.*wallet/i }));

      expect(onConnect).toHaveBeenCalled();
    });

    it('should show wallet options modal on connect', async () => {
      render(<WalletButton {...defaultProps} showWalletOptions />);

      await userEvent.click(screen.getByRole('button', { name: /connect.*wallet/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show wallet provider options', async () => {
      render(<WalletButton {...defaultProps} showWalletOptions />);

      await userEvent.click(screen.getByRole('button', { name: /connect.*wallet/i }));

      expect(screen.getByText(/metamask/i)).toBeInTheDocument();
      expect(screen.getByText(/walletconnect/i)).toBeInTheDocument();
      expect(screen.getByText(/coinbase/i)).toBeInTheDocument();
    });
  });

  describe('connected state', () => {
    it('should show connected wallet button', () => {
      render(<WalletButton {...connectedProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show truncated address', () => {
      render(<WalletButton {...connectedProps} />);

      expect(screen.getByText(/0x742d.*f44e/i)).toBeInTheDocument();
    });

    it('should show ENS name when available', () => {
      render(<WalletButton {...connectedProps} />);

      expect(screen.getByText('vitalik.eth')).toBeInTheDocument();
    });

    it('should show balance', () => {
      render(<WalletButton {...connectedProps} showBalance />);

      expect(screen.getByText('2.5 ETH')).toBeInTheDocument();
    });

    it('should show avatar/blockie', () => {
      render(<WalletButton {...connectedProps} />);

      expect(screen.getByTestId('wallet-avatar')).toBeInTheDocument();
    });
  });

  describe('dropdown menu', () => {
    it('should open dropdown on click when connected', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should show copy address option', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menuitem', { name: /copy.*address/i })).toBeInTheDocument();
    });

    it('should copy address to clipboard', async () => {
      const mockClipboard = vi.fn();
      Object.assign(navigator, {
        clipboard: { writeText: mockClipboard },
      });

      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /copy.*address/i }));

      expect(mockClipboard).toHaveBeenCalledWith(connectedProps.address);
    });

    it('should show view on explorer option', async () => {
      render(<WalletButton {...connectedProps} explorerUrl="https://etherscan.io" />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menuitem', { name: /view.*explorer/i })).toBeInTheDocument();
    });

    it('should show disconnect option', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menuitem', { name: /disconnect/i })).toBeInTheDocument();
    });

    it('should call onDisconnect when disconnect clicked', async () => {
      const onDisconnect = vi.fn();
      render(<WalletButton {...connectedProps} onDisconnect={onDisconnect} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /disconnect/i }));

      expect(onDisconnect).toHaveBeenCalled();
    });

    it('should close dropdown on click outside', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('wallet details modal', () => {
    it('should show wallet details option', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menuitem', { name: /wallet.*details|view.*wallet/i })).toBeInTheDocument();
    });

    it('should open wallet details modal', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /wallet.*details|view.*wallet/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should show full address in modal', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /wallet.*details|view.*wallet/i }));

      expect(screen.getByText(connectedProps.address)).toBeInTheDocument();
    });

    it('should show recent transactions', async () => {
      const transactions = [
        { hash: '0x123', type: 'swap', status: 'confirmed' },
        { hash: '0x456', type: 'approve', status: 'pending' },
      ];

      render(<WalletButton {...connectedProps} recentTransactions={transactions} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /wallet.*details|view.*wallet/i }));

      expect(screen.getByText(/recent.*transactions/i)).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show connecting state', () => {
      render(<WalletButton {...defaultProps} isConnecting />);

      expect(screen.getByText(/connecting/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should disable button while connecting', () => {
      render(<WalletButton {...defaultProps} isConnecting />);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('should show error state', () => {
      render(<WalletButton {...defaultProps} error="Connection failed" />);

      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });

    it('should show retry button on error', async () => {
      const onConnect = vi.fn();
      render(
        <WalletButton {...defaultProps} error="Error" onConnect={onConnect} />
      );

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));

      expect(onConnect).toHaveBeenCalled();
    });
  });

  describe('wrong network', () => {
    it('should show wrong network warning', () => {
      render(
        <WalletButton
          {...connectedProps}
          chainId={1}
          requiredChainId={137}
        />
      );

      expect(screen.getByText(/wrong.*network/i)).toBeInTheDocument();
    });

    it('should show switch network button', async () => {
      render(
        <WalletButton
          {...connectedProps}
          chainId={1}
          requiredChainId={137}
        />
      );

      expect(screen.getByRole('button', { name: /switch.*network/i })).toBeInTheDocument();
    });

    it('should call onSwitchNetwork when switch clicked', async () => {
      const onSwitchNetwork = vi.fn();
      render(
        <WalletButton
          {...connectedProps}
          chainId={1}
          requiredChainId={137}
          onSwitchNetwork={onSwitchNetwork}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /switch.*network/i }));

      expect(onSwitchNetwork).toHaveBeenCalledWith(137);
    });
  });

  describe('pending transactions', () => {
    it('should show pending transaction indicator', () => {
      render(
        <WalletButton
          {...connectedProps}
          pendingTransactions={2}
        />
      );

      expect(screen.getByTestId('pending-badge')).toHaveTextContent('2');
    });

    it('should show pulsing animation for pending', () => {
      render(
        <WalletButton
          {...connectedProps}
          pendingTransactions={1}
        />
      );

      expect(screen.getByTestId('pending-badge')).toHaveClass('animate-pulse');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<WalletButton {...connectedProps} variant="default" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render compact variant', () => {
      render(<WalletButton {...connectedProps} variant="compact" />);

      expect(screen.queryByText('vitalik.eth')).not.toBeInTheDocument();
      expect(screen.getByTestId('wallet-avatar')).toBeInTheDocument();
    });

    it('should render outline variant', () => {
      render(<WalletButton {...connectedProps} variant="outline" />);

      expect(screen.getByRole('button')).toHaveClass('border');
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<WalletButton {...defaultProps} size="sm" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<WalletButton {...defaultProps} size="md" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<WalletButton {...defaultProps} size="lg" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('custom avatar', () => {
    it('should show custom avatar when provided', () => {
      render(
        <WalletButton
          {...connectedProps}
          avatarUrl="https://example.com/avatar.png"
        />
      );

      const avatar = screen.getByTestId('wallet-avatar');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
    });

    it('should show blockie when no custom avatar', () => {
      render(<WalletButton {...connectedProps} />);

      expect(screen.getByTestId('blockie')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible connect button', () => {
      render(<WalletButton {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveAccessibleName(/connect.*wallet/i);
    });

    it('should have accessible menu', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should support keyboard navigation in menu', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.click(screen.getByRole('button'));
      await userEvent.keyboard('{ArrowDown}');

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[0]).toHaveFocus();
    });
  });

  describe('tooltip', () => {
    it('should show tooltip on hover', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.hover(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should show full address in tooltip', async () => {
      render(<WalletButton {...connectedProps} />);

      await userEvent.hover(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent(connectedProps.address);
      });
    });
  });
});

