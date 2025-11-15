/**
 * Debounce utility tests
 */

import { debounce } from '@/utils/performance/debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  test('delays function execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('cancels previous calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('passes arguments correctly', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced('arg1', 'arg2');

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});
