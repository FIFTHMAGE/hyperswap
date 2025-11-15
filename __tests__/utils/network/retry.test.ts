/**
 * Network retry utilities tests
 */

import { retryWithBackoff, isRetryableError } from '@/utils/network';

describe('Network Retry Utilities', () => {
  describe('retryWithBackoff', () => {
    test('succeeds on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('retries on failure', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelay: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('throws after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Always fails'));

      await expect(retryWithBackoff(fn, { maxRetries: 2, baseDelay: 10 })).rejects.toThrow(
        'Always fails'
      );

      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('respects shouldRetry option', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('No retry'));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 2,
          shouldRetry: () => false,
        })
      ).rejects.toThrow('No retry');

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('isRetryableError', () => {
    test('identifies timeout errors', () => {
      expect(isRetryableError(new Error('Request timeout'))).toBe(true);
    });

    test('identifies network errors', () => {
      expect(isRetryableError(new Error('Network error'))).toBe(true);
    });

    test('identifies connection errors', () => {
      expect(isRetryableError(new Error('ECONNRESET'))).toBe(true);
      expect(isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
    });

    test('rejects non-retryable errors', () => {
      expect(isRetryableError(new Error('Bad request'))).toBe(false);
    });
  });
});
