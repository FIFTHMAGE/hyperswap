/**
 * Individual form field hook
 */

import { useState, useCallback, ChangeEvent } from 'react';

export interface UseFormFieldOptions<T> {
  initialValue: T;
  validate?: (value: T) => string | null;
  onChange?: (value: T) => void;
}

export interface UseFormFieldReturn<T> {
  value: T;
  error: string | null;
  touched: boolean;
  setValue: (value: T) => void;
  setError: (error: string | null) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: () => void;
  reset: () => void;
}

export function useFormField<T = string>({
  initialValue,
  validate,
  onChange,
}: UseFormFieldOptions<T>): UseFormFieldReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value as unknown as T;
      setValue(newValue);
      onChange?.(newValue);
      if (touched && validate) {
        setError(validate(newValue));
      }
    },
    [touched, validate, onChange]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
  }, [value, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    setValue,
    setError,
    handleChange,
    handleBlur,
    reset,
  };
}

