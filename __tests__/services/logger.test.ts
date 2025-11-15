/**
 * Logger service tests
 */

import { logger } from '@/services/logger/logger.service';

describe('Logger Service', () => {
  beforeEach(() => {
    logger.clear();
  });

  test('logs debug messages', () => {
    logger.debug('test message', { key: 'value' });
    const logs = logger.getLogs('debug');

    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('test message');
    expect(logs[0].level).toBe('debug');
  });

  test('logs info messages', () => {
    logger.info('info message');
    const logs = logger.getLogs('info');

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('info');
  });

  test('logs warnings', () => {
    logger.warn('warning message');
    const logs = logger.getLogs('warn');

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('warn');
  });

  test('logs errors', () => {
    const error = new Error('test error');
    logger.error('error message', error);
    const logs = logger.getLogs('error');

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('error');
  });

  test('retrieves all logs', () => {
    logger.debug('debug');
    logger.info('info');
    logger.warn('warn');

    const allLogs = logger.getLogs();
    expect(allLogs).toHaveLength(3);
  });

  test('clears logs', () => {
    logger.info('test');
    logger.clear();

    expect(logger.getLogs()).toHaveLength(0);
  });
});
