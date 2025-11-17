/**
 * Number input component for amounts
 * @module components/ui/Input/NumberInput
 */

'use client';

import { styled } from 'nativewind';
import { forwardRef, type InputHTMLAttributes, useState, useEffect } from 'react';

import Input from './Input';

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  decimals?: number;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value = '', onChange, decimals = 18, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Allow empty string
      if (newValue === '') {
        setInternalValue('');
        onChange?.('');
        return;
      }

      // Validate number format
      const regex = decimals > 0 ? new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`) : /^\d+$/;

      if (regex.test(newValue)) {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={internalValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default styled(NumberInput);
