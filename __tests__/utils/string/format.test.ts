/**
 * String format utilities tests
 */

import {
  capitalize,
  capitalizeWords,
  camelCase,
  snakeCase,
  kebabCase,
} from '@/utils/string/format';

describe('String Formatting', () => {
  test('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
  });

  test('capitalizes all words', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  test('converts to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(camelCase('hello-world')).toBe('helloWorld');
    expect(camelCase('hello_world')).toBe('helloWorld');
  });

  test('converts to snake_case', () => {
    expect(snakeCase('helloWorld')).toBe('hello_world');
    expect(snakeCase('HelloWorld')).toBe('hello_world');
  });

  test('converts to kebab-case', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world');
    expect(kebabCase('HelloWorld')).toBe('hello-world');
  });
});
