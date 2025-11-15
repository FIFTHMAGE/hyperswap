/**
 * useFormField hook - Individual form field management
 * @module hooks/form
 */

import { useState, useCallback } from 'react';

interface UseFormFieldOptions<T> {
  initialValue: T;
  validate?: (value: T) => string | undefined;
}

export function useFormField<T>({ initialValue, validate }: UseFormFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (touched && validate) {
        setError(validate(newValue));
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
  }, [value, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    reset,
  };
}
