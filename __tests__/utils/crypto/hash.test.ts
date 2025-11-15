/**
 * Crypto hash utilities tests
 */

import { sha256, randomHex, uuid, simpleHash } from '@/utils/crypto';

describe('Crypto Hash Utilities', () => {
  describe('sha256', () => {
    test('generates consistent hash', async () => {
      const hash1 = await sha256('test');
      const hash2 = await sha256('test');
      expect(hash1).toBe(hash2);
    });

    test('generates different hash for different input', async () => {
      const hash1 = await sha256('test1');
      const hash2 = await sha256('test2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('randomHex', () => {
    test('generates hex string of correct length', () => {
      const hex = randomHex(16);
      expect(hex).toHaveLength(32);
      expect(/^[0-9a-f]+$/.test(hex)).toBe(true);
    });

    test('generates different values', () => {
      const hex1 = randomHex(16);
      const hex2 = randomHex(16);
      expect(hex1).not.toBe(hex2);
    });
  });

  describe('uuid', () => {
    test('generates valid UUID', () => {
      const id = uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('generates unique values', () => {
      const id1 = uuid();
      const id2 = uuid();
      expect(id1).not.toBe(id2);
    });
  });

  describe('simpleHash', () => {
    test('generates consistent hash', () => {
      const hash1 = simpleHash('test');
      const hash2 = simpleHash('test');
      expect(hash1).toBe(hash2);
    });

    test('generates different hash for different input', () => {
      const hash1 = simpleHash('test1');
      const hash2 = simpleHash('test2');
      expect(hash1).not.toBe(hash2);
    });

    test('returns positive number', () => {
      const hash = simpleHash('test');
      expect(hash).toBeGreaterThanOrEqual(0);
    });
  });
});
