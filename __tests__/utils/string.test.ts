/**
 * String utilities tests
 */

import {
  capitalize,
  truncate,
  truncateMiddle,
  camelCase,
  snakeCase,
  kebabCase,
} from '@/utils/string';

describe('String Utilities', () => {
  test('capitalizes string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
  });

  test('truncates string', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  test('truncates from middle', () => {
    expect(truncateMiddle('0x1234567890abcdef')).toBe('0x1234...cdef');
  });

  test('converts to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(camelCase('Hello World')).toBe('helloWorld');
  });

  test('converts to snake_case', () => {
    expect(snakeCase('helloWorld')).toBe('hello_world');
    expect(snakeCase('Hello World')).toBe('hello_world');
  });

  test('converts to kebab-case', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world');
    expect(kebabCase('Hello World')).toBe('hello-world');
  });
});
