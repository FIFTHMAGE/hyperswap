/**
 * TokenInput component tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { TokenInput } from '../TokenInput';

const mockToken = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logoURI: '/tokens/usdc.png',
  balance: '1000',
  price: 1,
};

describe('TokenInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    token: mockToken,
    onTokenSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render input field', () => {
      render(<TokenInput {...defaultProps} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render token selector button', () => {
      render(<TokenInput {...defaultProps} />);

      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('should show placeholder', () => {
      render(<TokenInput {...defaultProps} placeholder="0.0" />);

      expect(screen.getByPlaceholderText('0.0')).toBeInTheDocument();
    });

    it('should show value', () => {
      render(<TokenInput {...defaultProps} value="100" />);

      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    it('should show label', () => {
      render(<TokenInput {...defaultProps} label="From" />);

      expect(screen.getByText('From')).toBeInTheDocument();
    });
  });

  describe('input handling', () => {
    it('should call onChange when value changes', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} />);

      await userEvent.type(screen.getByRole('textbox'), '123');

      expect(onChange).toHaveBeenCalledWith('123');
    });

    it('should only allow numeric input', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'abc123');

      // Only numbers should be accepted
      expect(onChange).toHaveBeenLastCalledWith('123');
    });

    it('should allow decimal input', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} />);

      await userEvent.type(screen.getByRole('textbox'), '123.45');

      expect(onChange).toHaveBeenLastCalledWith('123.45');
    });

    it('should limit decimal places based on token decimals', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} />);

      await userEvent.type(screen.getByRole('textbox'), '123.4567890');

      // Should limit to 6 decimals for USDC
      expect(onChange).toHaveBeenLastCalledWith('123.456789');
    });

    it('should not allow multiple decimal points', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} value="123.45" />);

      await userEvent.type(screen.getByRole('textbox'), '.');

      expect(onChange).not.toHaveBeenCalledWith('123.45.');
    });
  });

  describe('balance', () => {
    it('should show token balance', () => {
      render(<TokenInput {...defaultProps} showBalance />);

      expect(screen.getByText(/balance/i)).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('should show max button', () => {
      render(<TokenInput {...defaultProps} showBalance showMax />);

      expect(screen.getByRole('button', { name: /max/i })).toBeInTheDocument();
    });

    it('should set max balance on max button click', async () => {
      const onChange = vi.fn();
      render(
        <TokenInput {...defaultProps} onChange={onChange} showBalance showMax />
      );

      await userEvent.click(screen.getByRole('button', { name: /max/i }));

      expect(onChange).toHaveBeenCalledWith('1000');
    });

    it('should show half button', () => {
      render(<TokenInput {...defaultProps} showBalance showHalf />);

      expect(screen.getByRole('button', { name: /half|50%/i })).toBeInTheDocument();
    });

    it('should set half balance on half button click', async () => {
      const onChange = vi.fn();
      render(
        <TokenInput {...defaultProps} onChange={onChange} showBalance showHalf />
      );

      await userEvent.click(screen.getByRole('button', { name: /half|50%/i }));

      expect(onChange).toHaveBeenCalledWith('500');
    });
  });

  describe('USD value', () => {
    it('should show USD value', () => {
      render(<TokenInput {...defaultProps} value="100" showUsdValue />);

      expect(screen.getByText(/\$100/)).toBeInTheDocument();
    });

    it('should update USD value when input changes', async () => {
      render(<TokenInput {...defaultProps} value="0" showUsdValue />);

      await userEvent.type(screen.getByRole('textbox'), '250');

      expect(screen.getByText(/\$250/)).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should disable input when disabled', () => {
      render(<TokenInput {...defaultProps} disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should disable token selector when disabled', () => {
      render(<TokenInput {...defaultProps} disabled />);

      const tokenButton = screen.getByText('USDC').closest('button');
      expect(tokenButton).toBeDisabled();
    });
  });

  describe('read only state', () => {
    it('should be read only when readOnly prop is true', () => {
      render(<TokenInput {...defaultProps} readOnly />);

      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<TokenInput {...defaultProps} error="Insufficient balance" />);

      expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<TokenInput {...defaultProps} error="Error" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('loading state', () => {
    it('should show loading indicator', () => {
      render(<TokenInput {...defaultProps} loading />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('token selection', () => {
    it('should call onTokenSelect when token selector clicked', async () => {
      const onTokenSelect = vi.fn();
      render(<TokenInput {...defaultProps} onTokenSelect={onTokenSelect} />);

      await userEvent.click(screen.getByText('USDC'));

      expect(onTokenSelect).toHaveBeenCalled();
    });

    it('should show "Select" when no token selected', () => {
      render(<TokenInput {...defaultProps} token={null} />);

      expect(screen.getByText(/select/i)).toBeInTheDocument();
    });
  });

  describe('percentage buttons', () => {
    it('should show percentage buttons', () => {
      render(<TokenInput {...defaultProps} showPercentages />);

      expect(screen.getByRole('button', { name: '25%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '50%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '75%' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '100%' })).toBeInTheDocument();
    });

    it('should set percentage of balance on click', async () => {
      const onChange = vi.fn();
      render(
        <TokenInput {...defaultProps} onChange={onChange} showPercentages />
      );

      await userEvent.click(screen.getByRole('button', { name: '25%' }));

      expect(onChange).toHaveBeenCalledWith('250'); // 25% of 1000
    });
  });

  describe('validation', () => {
    it('should validate against max value', async () => {
      const onChange = vi.fn();
      render(<TokenInput {...defaultProps} onChange={onChange} max="500" />);

      await userEvent.type(screen.getByRole('textbox'), '600');

      // Should show error or warning
      expect(screen.getByText(/exceeds/i)).toBeInTheDocument();
    });

    it('should validate against min value', () => {
      render(<TokenInput {...defaultProps} value="0.00001" min="0.001" />);

      expect(screen.getByText(/minimum/i)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible label', () => {
      render(<TokenInput {...defaultProps} label="Amount" id="amount" />);

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should have aria-describedby for error', () => {
      render(<TokenInput {...defaultProps} error="Error message" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<TokenInput {...defaultProps} size="sm" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<TokenInput {...defaultProps} size="md" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<TokenInput {...defaultProps} size="lg" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('swap button', () => {
    it('should not show swap button by default', () => {
      render(<TokenInput {...defaultProps} />);

      expect(screen.queryByRole('button', { name: /swap/i })).not.toBeInTheDocument();
    });

    it('should show swap button when showSwapButton is true', () => {
      render(<TokenInput {...defaultProps} showSwapButton onSwap={() => {}} />);

      expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
    });

    it('should call onSwap when swap button clicked', async () => {
      const onSwap = vi.fn();
      render(<TokenInput {...defaultProps} showSwapButton onSwap={onSwap} />);

      await userEvent.click(screen.getByRole('button', { name: /swap/i }));

      expect(onSwap).toHaveBeenCalled();
    });
  });
});

