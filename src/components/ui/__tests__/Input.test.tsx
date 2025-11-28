/**
 * Input component tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../Input';

describe('Input', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text..." />);

      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" id="email" />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="test value" onChange={() => {}} />);

      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('should render with default value', () => {
      render(<Input defaultValue="default" />);

      expect(screen.getByRole('textbox')).toHaveValue('default');
    });
  });

  describe('types', () => {
    it('should render text input by default', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);

      // Password inputs don't have role="textbox"
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onChange when typing', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'hello');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus when focused', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);

      fireEvent.focus(screen.getByRole('textbox'));

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when blurred', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should update value on controlled input', async () => {
      const TestComponent = () => {
        const [value, setValue] = vi.importActual<typeof import('react')>('react').useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      render(<TestComponent />);

      await userEvent.type(screen.getByRole('textbox'), 'test');

      expect(screen.getByRole('textbox')).toHaveValue('test');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not allow typing when disabled', async () => {
      const handleChange = vi.fn();
      render(<Input disabled onChange={handleChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'hello');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('readonly state', () => {
    it('should be readonly when readOnly prop is true', () => {
      render(<Input readOnly />);

      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
  });

  describe('error state', () => {
    it('should show error message', () => {
      render(<Input error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Input error="Error" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should connect error message with aria-describedby', () => {
      render(<Input error="Error message" id="test-input" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });
  });

  describe('helper text', () => {
    it('should show helper text', () => {
      render(<Input helperText="Enter your email address" />);

      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('should render with left icon', () => {
      render(
        <Input leftIcon={<span data-testid="left-icon">🔍</span>} />
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      render(
        <Input rightIcon={<span data-testid="right-icon">✓</span>} />
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Input size="sm" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      render(<Input size="md" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Input size="lg" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible name from label', () => {
      render(<Input label="Username" id="username" />);

      expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Search" />);

      expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
    });

    it('should have required attribute when required', () => {
      render(<Input required label="Required field" id="required" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });

    it('should mark required in label', () => {
      render(<Input required label="Email" id="email" />);

      const label = screen.getByText(/email/i);
      expect(label).toBeInTheDocument();
    });
  });

  describe('max length', () => {
    it('should have maxLength attribute', () => {
      render(<Input maxLength={50} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '50');
    });

    it('should show character count when showCount is true', async () => {
      render(<Input maxLength={10} showCount defaultValue="hello" />);

      expect(screen.getByText(/5.*10/)).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should merge custom className', () => {
      render(<Input className="custom-input" />);

      expect(screen.getByRole('textbox').closest('.custom-input')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('should show clear button when clearable and has value', async () => {
      render(<Input clearable defaultValue="test" />);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('should clear input when clear button clicked', async () => {
      const handleChange = vi.fn();
      render(<Input clearable defaultValue="test" onChange={handleChange} />);

      await userEvent.click(screen.getByRole('button', { name: /clear/i }));

      expect(handleChange).toHaveBeenCalled();
    });
  });
});

