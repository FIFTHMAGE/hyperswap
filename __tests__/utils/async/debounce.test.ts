/**
 * Debounce utility tests
 */

import { debounce, debounceLeading } from '@/utils/async/debounce';

describe('Debounce Utilities', () => {
  jest.useFakeTimers();

  describe('debounce', () => {
    test('delays function execution', () => {
      const func = jest.fn();
      const debounced = debounce(func, 1000);

      debounced();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 1000);

      debounced();
      debounced();
      debounced();

      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounceLeading', () => {
    test('executes immediately on first call', () => {
      const func = jest.fn();
      const debounced = debounceLeading(func, 1000);

      debounced();
      expect(func).toHaveBeenCalledTimes(1);
    });

    test('delays subsequent calls', () => {
      const func = jest.fn();
      const debounced = debounceLeading(func, 1000);

      debounced();
      debounced();

      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });
});
