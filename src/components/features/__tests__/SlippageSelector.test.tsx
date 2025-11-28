/**
 * SlippageSelector component tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { SlippageSelector } from '../SlippageSelector';

describe('SlippageSelector', () => {
  const defaultProps = {
    value: 0.5,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render slippage selector', () => {
      render(<SlippageSelector {...defaultProps} />);

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });

    it('should show current slippage value', () => {
      render(<SlippageSelector {...defaultProps} />);

      expect(screen.getByText('0.5%')).toBeInTheDocument();
    });

    it('should show preset buttons', () => {
      render(<SlippageSelector {...defaultProps} />);

      expect(screen.getByRole('button', { name: '0.1%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '0.5%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1%' })).toBeInTheDocument();
    });
  });

  describe('preset selection', () => {
    it('should call onChange when preset clicked', async () => {
      const onChange = vi.fn();
      render(<SlippageSelector {...defaultProps} onChange={onChange} />);

      await userEvent.click(screen.getByRole('button', { name: '1%' }));

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('should highlight selected preset', () => {
      render(<SlippageSelector {...defaultProps} value={0.5} />);

      const button = screen.getByRole('button', { name: '0.5%' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should support custom presets', () => {
      render(
        <SlippageSelector
          {...defaultProps}
          presets={[0.3, 0.5, 1.0, 2.0]}
        />
      );

      expect(screen.getByRole('button', { name: '0.3%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2%' })).toBeInTheDocument();
    });
  });

  describe('custom input', () => {
    it('should show custom input option', () => {
      render(<SlippageSelector {...defaultProps} allowCustom />);

      expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument();
    });

    it('should show input when custom selected', async () => {
      render(<SlippageSelector {...defaultProps} allowCustom />);

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should call onChange with custom value', async () => {
      const onChange = vi.fn();
      render(<SlippageSelector {...defaultProps} onChange={onChange} allowCustom />);

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));
      await userEvent.type(screen.getByRole('spinbutton'), '2.5');

      expect(onChange).toHaveBeenCalledWith(2.5);
    });

    it('should limit custom value to max', async () => {
      const onChange = vi.fn();
      render(
        <SlippageSelector
          {...defaultProps}
          onChange={onChange}
          allowCustom
          max={50}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));
      await userEvent.type(screen.getByRole('spinbutton'), '60');

      expect(onChange).not.toHaveBeenCalledWith(60);
    });

    it('should validate minimum value', async () => {
      render(
        <SlippageSelector
          {...defaultProps}
          allowCustom
          min={0.01}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /custom/i }));
      await userEvent.type(screen.getByRole('spinbutton'), '0.001');

      expect(screen.getByText(/minimum/i)).toBeInTheDocument();
    });
  });

  describe('warnings', () => {
    it('should show low slippage warning', () => {
      render(<SlippageSelector {...defaultProps} value={0.05} />);

      expect(screen.getByText(/transaction may fail/i)).toBeInTheDocument();
    });

    it('should show high slippage warning', () => {
      render(<SlippageSelector {...defaultProps} value={5} />);

      expect(screen.getByText(/frontrun|mev|loss/i)).toBeInTheDocument();
    });

    it('should not show warning for normal slippage', () => {
      render(<SlippageSelector {...defaultProps} value={0.5} />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('auto slippage', () => {
    it('should show auto option', () => {
      render(<SlippageSelector {...defaultProps} showAuto />);

      expect(screen.getByRole('button', { name: /auto/i })).toBeInTheDocument();
    });

    it('should select auto slippage', async () => {
      const onChange = vi.fn();
      render(
        <SlippageSelector {...defaultProps} onChange={onChange} showAuto />
      );

      await userEvent.click(screen.getByRole('button', { name: /auto/i }));

      expect(onChange).toHaveBeenCalledWith('auto');
    });

    it('should indicate when auto is selected', () => {
      render(<SlippageSelector {...defaultProps} value="auto" showAuto />);

      const autoButton = screen.getByRole('button', { name: /auto/i });
      expect(autoButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('tooltip', () => {
    it('should show info tooltip', async () => {
      render(<SlippageSelector {...defaultProps} showTooltip />);

      await userEvent.hover(screen.getByTestId('slippage-info'));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should explain slippage in tooltip', async () => {
      render(<SlippageSelector {...defaultProps} showTooltip />);

      await userEvent.hover(screen.getByTestId('slippage-info'));

      expect(screen.getByText(/price.*change/i)).toBeInTheDocument();
    });
  });

  describe('display modes', () => {
    it('should render inline mode', () => {
      render(<SlippageSelector {...defaultProps} display="inline" />);

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });

    it('should render popover mode', async () => {
      render(<SlippageSelector {...defaultProps} display="popover" />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render modal mode', async () => {
      render(<SlippageSelector {...defaultProps} display="modal" />);

      await userEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<SlippageSelector {...defaultProps} size="sm" />);

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<SlippageSelector {...defaultProps} size="md" />);

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<SlippageSelector {...defaultProps} size="lg" />);

      expect(screen.getByText(/slippage/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible group label', () => {
      render(<SlippageSelector {...defaultProps} />);

      expect(screen.getByRole('group')).toHaveAccessibleName(/slippage/i);
    });

    it('should support keyboard navigation', async () => {
      render(<SlippageSelector {...defaultProps} />);

      const firstButton = screen.getByRole('button', { name: '0.1%' });
      firstButton.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: '0.5%' })).toHaveFocus();
    });
  });

  describe('disabled state', () => {
    it('should disable all buttons when disabled', () => {
      render(<SlippageSelector {...defaultProps} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('read only state', () => {
    it('should not allow changes when readOnly', async () => {
      const onChange = vi.fn();
      render(<SlippageSelector {...defaultProps} onChange={onChange} readOnly />);

      await userEvent.click(screen.getByRole('button', { name: '1%' }));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('compact mode', () => {
    it('should render compact mode', () => {
      render(<SlippageSelector {...defaultProps} compact />);

      expect(screen.getByText('0.5%')).toBeInTheDocument();
      // Should only show value, not label
      expect(screen.queryByText(/slippage tolerance/i)).not.toBeInTheDocument();
    });
  });

  describe('frontrun protection', () => {
    it('should show MEV protection toggle', () => {
      render(<SlippageSelector {...defaultProps} showMevProtection />);

      expect(screen.getByText(/mev|frontrun/i)).toBeInTheDocument();
    });

    it('should recommend lower slippage with MEV protection', () => {
      render(
        <SlippageSelector
          {...defaultProps}
          showMevProtection
          mevProtectionEnabled
        />
      );

      expect(screen.getByText(/protected/i)).toBeInTheDocument();
    });
  });
});

