/**
 * GasEstimate component tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { GasEstimate } from '../GasEstimate';

const mockGasData = {
  gasPrice: '30',
  gasLimit: '150000',
  estimatedCost: '0.0045',
  estimatedCostUsd: '11.25',
  networkCongestion: 'medium',
  estimatedTime: '~30 seconds',
};

describe('GasEstimate', () => {
  const defaultProps = {
    gasPrice: mockGasData.gasPrice,
    gasLimit: mockGasData.gasLimit,
    estimatedCost: mockGasData.estimatedCost,
    estimatedCostUsd: mockGasData.estimatedCostUsd,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render gas estimate section', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByText(/gas/i)).toBeInTheDocument();
    });

    it('should show estimated cost in ETH', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByText('0.0045')).toBeInTheDocument();
    });

    it('should show estimated cost in USD', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByText(/\$11\.25/)).toBeInTheDocument();
    });

    it('should show gas price in gwei', () => {
      render(<GasEstimate {...defaultProps} showDetails />);

      expect(screen.getByText(/30.*gwei/i)).toBeInTheDocument();
    });

    it('should show gas limit', () => {
      render(<GasEstimate {...defaultProps} showDetails />);

      expect(screen.getByText('150000')).toBeInTheDocument();
    });
  });

  describe('network congestion', () => {
    it('should show low congestion indicator', () => {
      render(<GasEstimate {...defaultProps} networkCongestion="low" />);

      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });

    it('should show medium congestion indicator', () => {
      render(<GasEstimate {...defaultProps} networkCongestion="medium" />);

      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should show high congestion indicator', () => {
      render(<GasEstimate {...defaultProps} networkCongestion="high" />);

      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('should apply correct color for congestion level', () => {
      render(<GasEstimate {...defaultProps} networkCongestion="high" />);

      const indicator = screen.getByTestId('congestion-indicator');
      expect(indicator).toHaveClass('bg-red-500');
    });
  });

  describe('estimated time', () => {
    it('should show estimated transaction time', () => {
      render(<GasEstimate {...defaultProps} estimatedTime="~30 seconds" />);

      expect(screen.getByText('~30 seconds')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton', () => {
      render(<GasEstimate {...defaultProps} loading />);

      expect(screen.getByTestId('gas-estimate-skeleton')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<GasEstimate {...defaultProps} error="Failed to estimate gas" />);

      expect(screen.getByText('Failed to estimate gas')).toBeInTheDocument();
    });

    it('should show retry button on error', async () => {
      const onRetry = vi.fn();
      render(
        <GasEstimate {...defaultProps} error="Error" onRetry={onRetry} />
      );

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('gas speed options', () => {
    it('should show speed options when editable', () => {
      render(<GasEstimate {...defaultProps} editable />);

      expect(screen.getByText(/slow/i)).toBeInTheDocument();
      expect(screen.getByText(/standard/i)).toBeInTheDocument();
      expect(screen.getByText(/fast/i)).toBeInTheDocument();
    });

    it('should call onSpeedChange when speed selected', async () => {
      const onSpeedChange = vi.fn();
      render(
        <GasEstimate {...defaultProps} editable onSpeedChange={onSpeedChange} />
      );

      await userEvent.click(screen.getByText(/fast/i));

      expect(onSpeedChange).toHaveBeenCalledWith('fast');
    });

    it('should highlight selected speed', () => {
      render(<GasEstimate {...defaultProps} editable selectedSpeed="fast" />);

      const fastButton = screen.getByText(/fast/i).closest('button');
      expect(fastButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('custom gas', () => {
    it('should show custom gas input when enabled', () => {
      render(<GasEstimate {...defaultProps} editable allowCustom />);

      expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument();
    });

    it('should open custom gas modal on click', async () => {
      render(<GasEstimate {...defaultProps} editable allowCustom />);

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call onCustomGas when custom values set', async () => {
      const onCustomGas = vi.fn();
      render(
        <GasEstimate
          {...defaultProps}
          editable
          allowCustom
          onCustomGas={onCustomGas}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));
      await userEvent.type(screen.getByLabelText(/gas price/i), '50');
      await userEvent.click(screen.getByRole('button', { name: /apply/i }));

      expect(onCustomGas).toHaveBeenCalled();
    });
  });

  describe('collapsible', () => {
    it('should be collapsed by default when collapsible', () => {
      render(<GasEstimate {...defaultProps} collapsible />);

      expect(screen.queryByText(/gas limit/i)).not.toBeVisible();
    });

    it('should expand on click', async () => {
      render(<GasEstimate {...defaultProps} collapsible showDetails />);

      await userEvent.click(screen.getByRole('button', { name: /expand|details/i }));

      expect(screen.getByText(/gas limit/i)).toBeVisible();
    });
  });

  describe('refresh', () => {
    it('should show refresh button', () => {
      render(<GasEstimate {...defaultProps} showRefresh />);

      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    it('should call onRefresh when refresh clicked', async () => {
      const onRefresh = vi.fn();
      render(<GasEstimate {...defaultProps} showRefresh onRefresh={onRefresh} />);

      await userEvent.click(screen.getByRole('button', { name: /refresh/i }));

      expect(onRefresh).toHaveBeenCalled();
    });

    it('should show last updated time', () => {
      render(
        <GasEstimate {...defaultProps} showRefresh lastUpdated={Date.now()} />
      );

      expect(screen.getByText(/updated/i)).toBeInTheDocument();
    });
  });

  describe('tooltip', () => {
    it('should show tooltip on hover', async () => {
      render(<GasEstimate {...defaultProps} />);

      await userEvent.hover(screen.getByText(/gas/i));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should explain gas terms in tooltip', async () => {
      render(<GasEstimate {...defaultProps} />);

      await userEvent.hover(screen.getByText(/gas/i));

      expect(screen.getByText(/transaction fee/i)).toBeInTheDocument();
    });
  });

  describe('native token display', () => {
    it('should show ETH by default', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByText(/ETH/i)).toBeInTheDocument();
    });

    it('should show network native token', () => {
      render(<GasEstimate {...defaultProps} nativeToken="MATIC" />);

      expect(screen.getByText(/MATIC/i)).toBeInTheDocument();
    });
  });

  describe('comparison', () => {
    it('should show savings compared to default', () => {
      render(
        <GasEstimate
          {...defaultProps}
          showSavings
          defaultCost="0.006"
        />
      );

      expect(screen.getByText(/save/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible labels', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByText(/gas/i)).toBeInTheDocument();
    });

    it('should announce updates to screen readers', () => {
      render(<GasEstimate {...defaultProps} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});

