/**
 * TransactionStatus component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { TransactionStatus } from '../TransactionStatus';

const mockTransaction = {
  hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  status: 'pending',
  type: 'swap',
  fromToken: { symbol: 'ETH', amount: '1.0' },
  toToken: { symbol: 'USDC', amount: '2500' },
  timestamp: Date.now(),
  confirmations: 0,
  requiredConfirmations: 12,
};

describe('TransactionStatus', () => {
  const defaultProps = {
    transaction: mockTransaction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render transaction status', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(screen.getByText(/pending|processing/i)).toBeInTheDocument();
    });

    it('should show transaction hash', () => {
      render(<TransactionStatus {...defaultProps} showHash />);

      expect(screen.getByText(/0x1234/)).toBeInTheDocument();
    });

    it('should truncate long hash', () => {
      render(<TransactionStatus {...defaultProps} showHash />);

      const hash = screen.getByTestId('transaction-hash');
      expect(hash.textContent).toHaveLength(13); // 0x1234...cdef format
    });

    it('should show transaction type', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(screen.getByText(/swap/i)).toBeInTheDocument();
    });
  });

  describe('status states', () => {
    it('should show pending status', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(screen.getByText(/pending/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should show confirming status', () => {
      const tx = { ...mockTransaction, status: 'confirming', confirmations: 3 };
      render(<TransactionStatus transaction={tx} />);

      expect(screen.getByText(/confirming|3.*12/i)).toBeInTheDocument();
    });

    it('should show success status', () => {
      const tx = { ...mockTransaction, status: 'success' };
      render(<TransactionStatus transaction={tx} />);

      expect(screen.getByText(/success|confirmed/i)).toBeInTheDocument();
    });

    it('should show failed status', () => {
      const tx = { ...mockTransaction, status: 'failed', error: 'Out of gas' };
      render(<TransactionStatus transaction={tx} />);

      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });

    it('should show cancelled status', () => {
      const tx = { ...mockTransaction, status: 'cancelled' };
      render(<TransactionStatus transaction={tx} />);

      expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
    });
  });

  describe('progress', () => {
    it('should show confirmation progress', () => {
      const tx = { ...mockTransaction, status: 'confirming', confirmations: 6 };
      render(<TransactionStatus transaction={tx} showProgress />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '50'
      ); // 6/12 = 50%
    });

    it('should show animated spinner for pending', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should show view on explorer link', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(
        screen.getByRole('link', { name: /view.*explorer/i })
      ).toBeInTheDocument();
    });

    it('should have correct explorer link', () => {
      render(<TransactionStatus {...defaultProps} explorerUrl="https://etherscan.io" />);

      const link = screen.getByRole('link', { name: /view.*explorer/i });
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('etherscan.io')
      );
    });

    it('should show copy hash button', async () => {
      const mockClipboard = vi.fn();
      Object.assign(navigator, {
        clipboard: { writeText: mockClipboard },
      });

      render(<TransactionStatus {...defaultProps} showCopy />);

      await userEvent.click(screen.getByRole('button', { name: /copy/i }));

      expect(mockClipboard).toHaveBeenCalledWith(mockTransaction.hash);
    });

    it('should show speed up button for pending', () => {
      render(
        <TransactionStatus {...defaultProps} onSpeedUp={() => {}} />
      );

      expect(
        screen.getByRole('button', { name: /speed.*up/i })
      ).toBeInTheDocument();
    });

    it('should show cancel button for pending', () => {
      render(<TransactionStatus {...defaultProps} onCancel={() => {}} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should call onSpeedUp when speed up clicked', async () => {
      const onSpeedUp = vi.fn();
      render(<TransactionStatus {...defaultProps} onSpeedUp={onSpeedUp} />);

      await userEvent.click(screen.getByRole('button', { name: /speed.*up/i }));

      expect(onSpeedUp).toHaveBeenCalled();
    });

    it('should call onCancel when cancel clicked', async () => {
      const onCancel = vi.fn();
      render(<TransactionStatus {...defaultProps} onCancel={onCancel} />);

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('token amounts', () => {
    it('should show from token and amount', () => {
      render(<TransactionStatus {...defaultProps} showDetails />);

      expect(screen.getByText('1.0')).toBeInTheDocument();
      expect(screen.getByText('ETH')).toBeInTheDocument();
    });

    it('should show to token and amount', () => {
      render(<TransactionStatus {...defaultProps} showDetails />);

      expect(screen.getByText('2500')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('should show swap arrow', () => {
      render(<TransactionStatus {...defaultProps} showDetails />);

      expect(screen.getByTestId('swap-arrow')).toBeInTheDocument();
    });
  });

  describe('timestamp', () => {
    it('should show transaction timestamp', () => {
      render(<TransactionStatus {...defaultProps} showTimestamp />);

      expect(screen.getByText(/ago|just now/i)).toBeInTheDocument();
    });

    it('should show relative time', () => {
      const oldTx = {
        ...mockTransaction,
        timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      };
      render(<TransactionStatus transaction={oldTx} showTimestamp />);

      expect(screen.getByText(/5.*minutes.*ago/i)).toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('should show error message for failed transaction', () => {
      const tx = { ...mockTransaction, status: 'failed', error: 'Out of gas' };
      render(<TransactionStatus transaction={tx} />);

      expect(screen.getByText('Out of gas')).toBeInTheDocument();
    });

    it('should show retry button for failed', () => {
      const tx = { ...mockTransaction, status: 'failed' };
      render(<TransactionStatus transaction={tx} onRetry={() => {}} />);

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call onRetry when retry clicked', async () => {
      const onRetry = vi.fn();
      const tx = { ...mockTransaction, status: 'failed' };
      render(<TransactionStatus transaction={tx} onRetry={onRetry} />);

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('gas info', () => {
    it('should show gas used', () => {
      const tx = {
        ...mockTransaction,
        status: 'success',
        gasUsed: '150000',
        gasPrice: '30',
      };
      render(<TransactionStatus transaction={tx} showGas />);

      expect(screen.getByText(/150,?000/)).toBeInTheDocument();
    });

    it('should show gas cost in ETH', () => {
      const tx = {
        ...mockTransaction,
        status: 'success',
        gasCost: '0.0045',
      };
      render(<TransactionStatus transaction={tx} showGas />);

      expect(screen.getByText('0.0045')).toBeInTheDocument();
    });
  });

  describe('notification', () => {
    it('should call onComplete when transaction succeeds', async () => {
      const onComplete = vi.fn();
      const { rerender } = render(
        <TransactionStatus {...defaultProps} onComplete={onComplete} />
      );

      const successTx = { ...mockTransaction, status: 'success' };
      rerender(<TransactionStatus transaction={successTx} onComplete={onComplete} />);

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith(successTx);
      });
    });

    it('should call onFailed when transaction fails', async () => {
      const onFailed = vi.fn();
      const { rerender } = render(
        <TransactionStatus {...defaultProps} onFailed={onFailed} />
      );

      const failedTx = { ...mockTransaction, status: 'failed' };
      rerender(<TransactionStatus transaction={failedTx} onFailed={onFailed} />);

      await waitFor(() => {
        expect(onFailed).toHaveBeenCalledWith(failedTx);
      });
    });
  });

  describe('variants', () => {
    it('should render compact variant', () => {
      render(<TransactionStatus {...defaultProps} variant="compact" />);

      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('should render detailed variant', () => {
      render(<TransactionStatus {...defaultProps} variant="detailed" />);

      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('should render card variant', () => {
      render(<TransactionStatus {...defaultProps} variant="card" />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible status', () => {
      render(<TransactionStatus {...defaultProps} />);

      expect(screen.getByRole('status')).toHaveAccessibleName();
    });

    it('should announce status changes', async () => {
      const { rerender } = render(<TransactionStatus {...defaultProps} />);

      const successTx = { ...mockTransaction, status: 'success' };
      rerender(<TransactionStatus transaction={successTx} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('animation', () => {
    it('should animate status change', () => {
      render(<TransactionStatus {...defaultProps} animated />);

      expect(screen.getByTestId('status-animation')).toBeInTheDocument();
    });

    it('should show confetti on success', () => {
      const tx = { ...mockTransaction, status: 'success' };
      render(<TransactionStatus transaction={tx} showConfetti />);

      expect(screen.getByTestId('confetti')).toBeInTheDocument();
    });
  });
});

