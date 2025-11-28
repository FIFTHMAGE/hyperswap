/**
 * PriceChart component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { PriceChart } from '../PriceChart';

const mockPriceData = [
  { timestamp: Date.now() - 24 * 60 * 60 * 1000, price: 2400 },
  { timestamp: Date.now() - 18 * 60 * 60 * 1000, price: 2450 },
  { timestamp: Date.now() - 12 * 60 * 60 * 1000, price: 2420 },
  { timestamp: Date.now() - 6 * 60 * 60 * 1000, price: 2480 },
  { timestamp: Date.now(), price: 2500 },
];

describe('PriceChart', () => {
  const defaultProps = {
    data: mockPriceData,
    tokenSymbol: 'ETH',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render chart container', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByTestId('price-chart')).toBeInTheDocument();
    });

    it('should render chart with data', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
    });

    it('should show current price', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByText(/2,?500/)).toBeInTheDocument();
    });

    it('should show token symbol', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByText('ETH')).toBeInTheDocument();
    });
  });

  describe('time intervals', () => {
    it('should show time interval buttons', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByRole('button', { name: '1H' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '24H' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '7D' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1M' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1Y' })).toBeInTheDocument();
    });

    it('should call onIntervalChange when interval selected', async () => {
      const onIntervalChange = vi.fn();
      render(
        <PriceChart {...defaultProps} onIntervalChange={onIntervalChange} />
      );

      await userEvent.click(screen.getByRole('button', { name: '7D' }));

      expect(onIntervalChange).toHaveBeenCalledWith('7D');
    });

    it('should highlight selected interval', () => {
      render(<PriceChart {...defaultProps} interval="24H" />);

      const button = screen.getByRole('button', { name: '24H' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should support custom intervals', () => {
      render(
        <PriceChart
          {...defaultProps}
          intervals={['1H', '4H', '1D', '1W']}
        />
      );

      expect(screen.getByRole('button', { name: '4H' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1W' })).toBeInTheDocument();
    });
  });

  describe('price change', () => {
    it('should show positive price change', () => {
      render(<PriceChart {...defaultProps} priceChange={4.17} />);

      expect(screen.getByText(/\+4\.17%/)).toBeInTheDocument();
    });

    it('should show negative price change', () => {
      render(<PriceChart {...defaultProps} priceChange={-2.5} />);

      expect(screen.getByText(/-2\.5%/)).toBeInTheDocument();
    });

    it('should apply green color for positive change', () => {
      render(<PriceChart {...defaultProps} priceChange={4.17} />);

      const changeElement = screen.getByTestId('price-change');
      expect(changeElement).toHaveClass('text-green-500');
    });

    it('should apply red color for negative change', () => {
      render(<PriceChart {...defaultProps} priceChange={-2.5} />);

      const changeElement = screen.getByTestId('price-change');
      expect(changeElement).toHaveClass('text-red-500');
    });

    it('should show absolute change amount', () => {
      render(
        <PriceChart
          {...defaultProps}
          priceChange={4.17}
          absoluteChange={100}
        />
      );

      expect(screen.getByText(/\$100/)).toBeInTheDocument();
    });
  });

  describe('chart type', () => {
    it('should render line chart by default', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should render candlestick chart', () => {
      render(<PriceChart {...defaultProps} chartType="candlestick" />);

      expect(screen.getByTestId('candlestick-chart')).toBeInTheDocument();
    });

    it('should render area chart', () => {
      render(<PriceChart {...defaultProps} chartType="area" />);

      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('should show chart type selector', () => {
      render(<PriceChart {...defaultProps} showChartTypeSelector />);

      expect(screen.getByRole('button', { name: /chart.*type/i })).toBeInTheDocument();
    });

    it('should change chart type on selection', async () => {
      const onChartTypeChange = vi.fn();
      render(
        <PriceChart
          {...defaultProps}
          showChartTypeSelector
          onChartTypeChange={onChartTypeChange}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /chart.*type/i }));
      await userEvent.click(screen.getByText(/candlestick/i));

      expect(onChartTypeChange).toHaveBeenCalledWith('candlestick');
    });
  });

  describe('hover interaction', () => {
    it('should show tooltip on hover', async () => {
      render(<PriceChart {...defaultProps} />);

      await userEvent.hover(screen.getByTestId('price-chart'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should show price at hover point', async () => {
      render(<PriceChart {...defaultProps} />);

      await userEvent.hover(screen.getByTestId('price-chart'));

      await waitFor(() => {
        expect(screen.getByTestId('hover-price')).toBeInTheDocument();
      });
    });

    it('should show timestamp at hover point', async () => {
      render(<PriceChart {...defaultProps} />);

      await userEvent.hover(screen.getByTestId('price-chart'));

      await waitFor(() => {
        expect(screen.getByTestId('hover-time')).toBeInTheDocument();
      });
    });

    it('should show crosshair on hover', async () => {
      render(<PriceChart {...defaultProps} showCrosshair />);

      await userEvent.hover(screen.getByTestId('price-chart'));

      expect(screen.getByTestId('crosshair')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton', () => {
      render(<PriceChart {...defaultProps} loading />);

      expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
    });

    it('should show loading indicator', () => {
      render(<PriceChart {...defaultProps} loading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(
        <PriceChart {...defaultProps} error="Failed to load price data" />
      );

      expect(screen.getByText('Failed to load price data')).toBeInTheDocument();
    });

    it('should show retry button on error', async () => {
      const onRetry = vi.fn();
      render(
        <PriceChart {...defaultProps} error="Error" onRetry={onRetry} />
      );

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('empty state', () => {
    it('should show empty state when no data', () => {
      render(<PriceChart {...defaultProps} data={[]} />);

      expect(screen.getByText(/no.*data/i)).toBeInTheDocument();
    });
  });

  describe('comparison', () => {
    it('should show comparison token', () => {
      render(
        <PriceChart
          {...defaultProps}
          comparisonToken="BTC"
          comparisonData={mockPriceData}
        />
      );

      expect(screen.getByText('BTC')).toBeInTheDocument();
    });

    it('should render two lines for comparison', () => {
      render(
        <PriceChart
          {...defaultProps}
          comparisonToken="BTC"
          comparisonData={mockPriceData}
        />
      );

      expect(screen.getAllByTestId('chart-line')).toHaveLength(2);
    });
  });

  describe('volume', () => {
    it('should show volume bars', () => {
      render(
        <PriceChart
          {...defaultProps}
          showVolume
          volumeData={[
            { timestamp: Date.now(), volume: 1000000 },
          ]}
        />
      );

      expect(screen.getByTestId('volume-chart')).toBeInTheDocument();
    });

    it('should show volume in tooltip', async () => {
      render(
        <PriceChart
          {...defaultProps}
          showVolume
          volumeData={[
            { timestamp: Date.now(), volume: 1000000 },
          ]}
        />
      );

      await userEvent.hover(screen.getByTestId('price-chart'));

      await waitFor(() => {
        expect(screen.getByText(/volume/i)).toBeInTheDocument();
      });
    });
  });

  describe('high/low markers', () => {
    it('should show high marker', () => {
      render(<PriceChart {...defaultProps} showHighLow />);

      expect(screen.getByText(/high/i)).toBeInTheDocument();
      expect(screen.getByText(/2,?500/)).toBeInTheDocument();
    });

    it('should show low marker', () => {
      render(<PriceChart {...defaultProps} showHighLow />);

      expect(screen.getByText(/low/i)).toBeInTheDocument();
      expect(screen.getByText(/2,?400/)).toBeInTheDocument();
    });
  });

  describe('fullscreen', () => {
    it('should show fullscreen button', () => {
      render(<PriceChart {...defaultProps} allowFullscreen />);

      expect(
        screen.getByRole('button', { name: /fullscreen/i })
      ).toBeInTheDocument();
    });

    it('should enter fullscreen mode', async () => {
      render(<PriceChart {...defaultProps} allowFullscreen />);

      await userEvent.click(screen.getByRole('button', { name: /fullscreen/i }));

      expect(screen.getByTestId('fullscreen-chart')).toBeInTheDocument();
    });
  });

  describe('themes', () => {
    it('should apply light theme', () => {
      render(<PriceChart {...defaultProps} theme="light" />);

      expect(screen.getByTestId('price-chart')).toHaveClass('theme-light');
    });

    it('should apply dark theme', () => {
      render(<PriceChart {...defaultProps} theme="dark" />);

      expect(screen.getByTestId('price-chart')).toHaveClass('theme-dark');
    });
  });

  describe('accessibility', () => {
    it('should have accessible chart', () => {
      render(<PriceChart {...defaultProps} />);

      expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
    });

    it('should have accessible interval buttons', () => {
      render(<PriceChart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should support keyboard navigation', async () => {
      render(<PriceChart {...defaultProps} />);

      const firstButton = screen.getByRole('button', { name: '1H' });
      firstButton.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: '24H' })).toHaveFocus();
    });
  });

  describe('responsive', () => {
    it('should adjust height for mobile', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<PriceChart {...defaultProps} />);

      expect(screen.getByTestId('price-chart')).toHaveClass('mobile');
    });
  });
});

