/**
 * Form utilities for component inputs
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export function validateInput(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.required && !value) {
      return rule.message;
    }
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }
  return null;
}

export const commonRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  ethereumAddress: {
    pattern: /^0x[a-fA-F0-9]{40}$/,
    message: 'Please enter a valid Ethereum address',
  },
  positiveNumber: {
    custom: (value: string) => !isNaN(Number(value)) && Number(value) > 0,
    message: 'Please enter a positive number',
  },
};

