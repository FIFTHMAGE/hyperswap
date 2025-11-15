/**
 * Wrapped data validation utilities
 */

export class WrappedValidation {
  static validateAddress(address: string): boolean {
    // Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static validateYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 2020 && year <= currentYear;
  }

  static validateWrappedData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Data is required');
      return { valid: false, errors };
    }

    if (!data.generatedAt) {
      errors.push('Generated timestamp is required');
    }

    if (!data.quarters || !Array.isArray(data.quarters)) {
      errors.push('Quarterly data is invalid');
    }

    // Add more validation rules as needed

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sanitizeData(data: any): any {
    // Remove sensitive information
    const sanitized = { ...data };
    delete sanitized.privateKey;
    delete sanitized.apiKey;
    return sanitized;
  }
}

