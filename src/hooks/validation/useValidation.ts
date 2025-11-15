/**
 * Validation hooks
 */

import { useState, useCallback } from 'react';

export type ValidationRule<T> = (value: T) => string | null;

export interface UseValidationOptions<T> {
  initialValue: T;
  rules: ValidationRule<T>[];
}

export interface UseValidationReturn<T> {
  value: T;
  error: string | null;
  isValid: boolean;
  validate: () => boolean;
  setValue: (value: T) => void;
  reset: () => void;
}

export function useValidation<T>({
  initialValue,
  rules,
}: UseValidationOptions<T>): UseValidationReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    for (const rule of rules) {
      const errorMessage = rule(value);
      if (errorMessage) {
        setError(errorMessage);
        return false;
      }
    }
    setError(null);
    return true;
  }, [value, rules]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    error,
    isValid: error === null,
    validate,
    setValue,
    reset,
  };
}

// Common validation rules
export const validationRules = {
  required: <T>(message: string = 'This field is required'): ValidationRule<T> => {
    return (value: T) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return null;
    };
  },

  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value: string) => {
      if (value.length < min) {
        return message || `Minimum length is ${min} characters`;
      }
      return null;
    };
  },

  maxLength: (max: number, message?: string): ValidationRule<string> => {
    return (value: string) => {
      if (value.length > max) {
        return message || `Maximum length is ${max} characters`;
      }
      return null;
    };
  },

  pattern: (regex: RegExp, message: string): ValidationRule<string> => {
    return (value: string) => {
      if (!regex.test(value)) {
        return message;
      }
      return null;
    };
  },

  email: (message: string = 'Invalid email address'): ValidationRule<string> => {
    return validationRules.pattern(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message
    );
  },

  url: (message: string = 'Invalid URL'): ValidationRule<string> => {
    return validationRules.pattern(
      /^https?:\/\/.+/,
      message
    );
  },
};

