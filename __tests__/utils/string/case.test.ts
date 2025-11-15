/**
 * String case conversion tests
 */

import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
} from '@/utils/string/case';

describe('String Case Utilities', () => {
  describe('toCamelCase', () => {
    test('converts to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('toPascalCase', () => {
    test('converts to PascalCase', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('toSnakeCase', () => {
    test('converts to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('toKebabCase', () => {
    test('converts to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('toConstantCase', () => {
    test('converts to CONSTANT_CASE', () => {
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
    });
  });

  describe('toTitleCase', () => {
    test('converts to Title Case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('hello-world')).toBe('Hello World');
    });
  });
});
