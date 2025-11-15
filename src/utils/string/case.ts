/**
 * String case conversion utilities
 * @module utils/string
 */

/**
 * Convert to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert to PascalCase
 */
export function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Convert to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Convert to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Convert to CONSTANT_CASE
 */
export function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

/**
 * Convert to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
