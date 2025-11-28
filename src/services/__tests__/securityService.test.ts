/**
 * Security Service tests
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

import { SecurityService } from '../core/security/security.service';

describe('SecurityService', () => {
  let security: SecurityService;

  beforeEach(() => {
    security = new SecurityService({
      encryptionKey: 'test-encryption-key-32-chars-lng',
    });
  });

  describe('generateNonce', () => {
    it('should generate unique nonces', () => {
      const nonce1 = security.generateNonce();
      const nonce2 = security.generateNonce();

      expect(nonce1).not.toBe(nonce2);
    });

    it('should generate nonces of specified length', () => {
      const nonce = security.generateNonce(32);

      // Hex encoding doubles the bytes
      expect(nonce.length).toBe(64);
    });

    it('should generate hex string', () => {
      const nonce = security.generateNonce();

      expect(/^[a-f0-9]+$/i.test(nonce)).toBe(true);
    });
  });

  describe('hashData', () => {
    it('should hash data consistently', () => {
      const data = 'test-data';
      const hash1 = security.hashData(data);
      const hash2 = security.hashData(data);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different data', () => {
      const hash1 = security.hashData('data1');
      const hash2 = security.hashData('data2');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = security.hashData('');

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('createSignature', () => {
    it('should create signature for message', () => {
      const message = 'test message';
      const signature = security.createSignature(message);

      expect(signature).toBeDefined();
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should create consistent signatures', () => {
      const message = 'test message';
      const sig1 = security.createSignature(message);
      const sig2 = security.createSignature(message);

      expect(sig1).toBe(sig2);
    });

    it('should create different signatures for different messages', () => {
      const sig1 = security.createSignature('message1');
      const sig2 = security.createSignature('message2');

      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', () => {
      const message = 'test message';
      const signature = security.createSignature(message);

      expect(security.verifySignature(message, signature)).toBe(true);
    });

    it('should reject invalid signature', () => {
      const message = 'test message';

      expect(security.verifySignature(message, 'invalid-signature')).toBe(false);
    });

    it('should reject tampered message', () => {
      const message = 'test message';
      const signature = security.createSignature(message);

      expect(security.verifySignature('tampered message', signature)).toBe(false);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data', () => {
      const data = 'sensitive data';
      const encrypted = security.encrypt(data);

      expect(encrypted).not.toBe(data);

      const decrypted = security.decrypt(encrypted);

      expect(decrypted).toBe(data);
    });

    it('should encrypt complex objects', () => {
      const data = { user: 'test', balance: 100 };
      const encrypted = security.encrypt(JSON.stringify(data));
      const decrypted = JSON.parse(security.decrypt(encrypted));

      expect(decrypted).toEqual(data);
    });

    it('should produce different ciphertext for same plaintext', () => {
      // Due to IV, same plaintext should produce different ciphertext
      const data = 'test data';
      const encrypted1 = security.encrypt(data);
      const encrypted2 = security.encrypt(data);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle empty string', () => {
      const encrypted = security.encrypt('');
      const decrypted = security.decrypt(encrypted);

      expect(decrypted).toBe('');
    });
  });

  describe('generateApiKey', () => {
    it('should generate unique API keys', () => {
      const key1 = security.generateApiKey();
      const key2 = security.generateApiKey();

      expect(key1).not.toBe(key2);
    });

    it('should generate keys with prefix', () => {
      const key = security.generateApiKey('sk_');

      expect(key.startsWith('sk_')).toBe(true);
    });

    it('should generate URL-safe keys', () => {
      const key = security.generateApiKey();

      expect(/^[a-zA-Z0-9_-]+$/.test(key)).toBe(true);
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      const key = security.generateApiKey('sk_');

      expect(security.validateApiKey(key)).toBe(true);
    });

    it('should reject invalid API key format', () => {
      expect(security.validateApiKey('too-short')).toBe(false);
      expect(security.validateApiKey('')).toBe(false);
    });
  });

  describe('sanitizeForSigning', () => {
    it('should create deterministic message for signing', () => {
      const data = {
        to: '0x123',
        value: '100',
        nonce: 1,
      };

      const sanitized1 = security.sanitizeForSigning(data);
      const sanitized2 = security.sanitizeForSigning(data);

      expect(sanitized1).toBe(sanitized2);
    });

    it('should handle different key orders', () => {
      const data1 = { a: 1, b: 2 };
      const data2 = { b: 2, a: 1 };

      const sanitized1 = security.sanitizeForSigning(data1);
      const sanitized2 = security.sanitizeForSigning(data2);

      expect(sanitized1).toBe(sanitized2);
    });
  });

  describe('isTimestampValid', () => {
    it('should validate recent timestamp', () => {
      const now = Date.now();

      expect(security.isTimestampValid(now)).toBe(true);
    });

    it('should reject old timestamp', () => {
      const oldTimestamp = Date.now() - 60 * 60 * 1000; // 1 hour ago

      expect(security.isTimestampValid(oldTimestamp)).toBe(false);
    });

    it('should reject future timestamp', () => {
      const futureTimestamp = Date.now() + 60 * 60 * 1000; // 1 hour in future

      expect(security.isTimestampValid(futureTimestamp)).toBe(false);
    });

    it('should use custom validity window', () => {
      const recentTimestamp = Date.now() - 30 * 1000; // 30 seconds ago

      expect(security.isTimestampValid(recentTimestamp, 60 * 1000)).toBe(true);
      expect(security.isTimestampValid(recentTimestamp, 10 * 1000)).toBe(false);
    });
  });

  describe('createAuthToken', () => {
    it('should create auth token with payload', () => {
      const payload = { userId: '123', role: 'user' };
      const token = security.createAuthToken(payload);

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
    });

    it('should create verifiable tokens', () => {
      const payload = { userId: '123' };
      const token = security.createAuthToken(payload);
      const decoded = security.verifyAuthToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe('123');
    });
  });

  describe('verifyAuthToken', () => {
    it('should verify valid token', () => {
      const payload = { userId: '123' };
      const token = security.createAuthToken(payload);

      const result = security.verifyAuthToken(token);

      expect(result).not.toBeNull();
    });

    it('should reject invalid token', () => {
      const result = security.verifyAuthToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should reject tampered token', () => {
      const payload = { userId: '123' };
      const token = security.createAuthToken(payload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      const result = security.verifyAuthToken(tamperedToken);

      expect(result).toBeNull();
    });
  });

  describe('rateLimit tracking', () => {
    it('should track request counts', () => {
      const key = 'test-key';

      security.trackRequest(key);
      security.trackRequest(key);
      security.trackRequest(key);

      expect(security.getRequestCount(key)).toBe(3);
    });

    it('should check rate limit', () => {
      const key = 'test-key';

      for (let i = 0; i < 10; i++) {
        security.trackRequest(key);
      }

      expect(security.isRateLimited(key, 10)).toBe(true);
      expect(security.isRateLimited(key, 20)).toBe(false);
    });
  });
});

