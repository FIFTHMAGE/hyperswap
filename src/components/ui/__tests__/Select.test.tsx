/**
 * Select component tests
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from '../Select';

const options = [
  { value: 'eth', label: 'Ethereum' },
  { value: 'btc', label: 'Bitcoin' },
  { value: 'usdc', label: 'USD Coin' },
  { value: 'dai', label: 'DAI' },
];

describe('Select', () => {
  describe('rendering', () => {
    it('should render select element', () => {
      render(<Select options={options} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Select options={options} placeholder="Select a token..." />);

      expect(screen.getByText('Select a token...')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Select options={options} label="Token" id="token" />);

      expect(screen.getByLabelText('Token')).toBeInTheDocument();
    });

    it('should render all options', async () => {
      render(<Select options={options} />);

      await userEvent.click(screen.getByRole('combobox'));

      options.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should render selected value', () => {
      render(<Select options={options} value="eth" onChange={() => {}} />);

      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should call onChange when option selected', async () => {
      const handleChange = vi.fn();
      render(<Select options={options} onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Bitcoin'));

      expect(handleChange).toHaveBeenCalledWith('btc');
    });

    it('should update selected value', async () => {
      const TestComponent = () => {
        const [value, setValue] = vi.importActual<typeof import('react')>('react').useState('');
        return <Select options={options} value={value} onChange={setValue} />;
      };

      render(<TestComponent />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('DAI'));

      expect(screen.getByText('DAI')).toBeInTheDocument();
    });

    it('should close dropdown after selection', async () => {
      render(<Select options={options} onChange={() => {}} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Bitcoin'));

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Select options={options} disabled />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should not open dropdown when disabled', async () => {
      render(<Select options={options} disabled />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('disabled options', () => {
    it('should disable specific options', async () => {
      const optionsWithDisabled = [
        { value: 'eth', label: 'Ethereum' },
        { value: 'btc', label: 'Bitcoin', disabled: true },
        { value: 'usdc', label: 'USD Coin' },
      ];

      render(<Select options={optionsWithDisabled} onChange={() => {}} />);

      await userEvent.click(screen.getByRole('combobox'));

      const disabledOption = screen.getByText('Bitcoin');
      expect(disabledOption.closest('[role="option"]')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('should not select disabled option', async () => {
      const handleChange = vi.fn();
      const optionsWithDisabled = [
        { value: 'eth', label: 'Ethereum' },
        { value: 'btc', label: 'Bitcoin', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Bitcoin'));

      expect(handleChange).not.toHaveBeenCalledWith('btc');
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<Select options={options} error="Please select a token" />);

      expect(screen.getByText('Please select a token')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Select options={options} error="Error" />);

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('helper text', () => {
    it('should show helper text', () => {
      render(<Select options={options} helperText="Select your preferred token" />);

      expect(screen.getByText('Select your preferred token')).toBeInTheDocument();
    });
  });

  describe('searchable', () => {
    it('should show search input when searchable', async () => {
      render(<Select options={options} searchable />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should filter options based on search', async () => {
      render(<Select options={options} searchable />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByRole('searchbox'), 'bit');

      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });

    it('should show no results message when no matches', async () => {
      render(<Select options={options} searchable />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByRole('searchbox'), 'xyz');

      expect(screen.getByText(/no.*results/i)).toBeInTheDocument();
    });
  });

  describe('clearable', () => {
    it('should show clear button when clearable and has value', () => {
      render(
        <Select options={options} clearable value="eth" onChange={() => {}} />
      );

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('should clear selection when clear button clicked', async () => {
      const handleChange = vi.fn();
      render(
        <Select options={options} clearable value="eth" onChange={handleChange} />
      );

      await userEvent.click(screen.getByRole('button', { name: /clear/i }));

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('should not show clear button when no value', () => {
      render(<Select options={options} clearable onChange={() => {}} />);

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('should open dropdown on Enter', async () => {
      render(<Select options={options} />);

      screen.getByRole('combobox').focus();
      await userEvent.keyboard('{Enter}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open dropdown on Space', async () => {
      render(<Select options={options} />);

      screen.getByRole('combobox').focus();
      await userEvent.keyboard(' ');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should close dropdown on Escape', async () => {
      render(<Select options={options} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should navigate options with arrow keys', async () => {
      render(<Select options={options} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');

      const firstOption = screen.getByText('Ethereum').closest('[role="option"]');
      expect(firstOption).toHaveAttribute('data-highlighted', 'true');
    });

    it('should select option on Enter', async () => {
      const handleChange = vi.fn();
      render(<Select options={options} onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{Enter}');

      expect(handleChange).toHaveBeenCalledWith('eth');
    });
  });

  describe('grouped options', () => {
    it('should render option groups', async () => {
      const groupedOptions = [
        {
          label: 'Popular',
          options: [
            { value: 'eth', label: 'Ethereum' },
            { value: 'btc', label: 'Bitcoin' },
          ],
        },
        {
          label: 'Stablecoins',
          options: [
            { value: 'usdc', label: 'USD Coin' },
            { value: 'dai', label: 'DAI' },
          ],
        },
      ];

      render(<Select options={groupedOptions} />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('Stablecoins')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible name from label', () => {
      render(<Select options={options} label="Token" id="token" />);

      expect(screen.getByRole('combobox', { name: /token/i })).toBeInTheDocument();
    });

    it('should have aria-expanded attribute', async () => {
      render(<Select options={options} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(combobox);
      expect(combobox).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-haspopup="listbox"', () => {
      render(<Select options={options} />);

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-haspopup',
        'listbox'
      );
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Select options={options} size="sm" />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Select options={options} size="md" />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Select options={options} size="lg" />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('custom option rendering', () => {
    it('should render custom option component', async () => {
      const optionsWithIcons = [
        { value: 'eth', label: 'Ethereum', icon: '⟠' },
        { value: 'btc', label: 'Bitcoin', icon: '₿' },
      ];

      render(
        <Select
          options={optionsWithIcons}
          renderOption={(option) => (
            <span>
              {option.icon} {option.label}
            </span>
          )}
        />
      );

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByText(/⟠.*ethereum/i)).toBeInTheDocument();
      expect(screen.getByText(/₿.*bitcoin/i)).toBeInTheDocument();
    });
  });
});

