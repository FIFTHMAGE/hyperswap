/**
 * Signature validation service
 * @module services/auth
 */

import type { Address } from '@/types/blockchain.types';

class SignatureValidatorService {
  /**
   * Verify message signature
   */
  async verifySignature(
    message: string,
    signature: string,
    _expectedAddress: Address
  ): Promise<boolean> {
    try {
      // In production, use ethers.js or viem for actual verification
      // This is a placeholder implementation
      // _expectedAddress will be used in actual implementation
      return message.length > 0 && signature.length === 132 && signature.startsWith('0x');
    } catch {
      return false;
    }
  }

  /**
   * Create authentication message
   */
  createAuthMessage(nonce: string, timestamp: number): string {
    return `Sign this message to authenticate:\n\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
  }

  /**
   * Validate nonce format
   */
  validateNonce(nonce: string): boolean {
    return /^[a-zA-Z0-9]{32,64}$/.test(nonce);
  }

  /**
   * Check if signature is expired
   */
  isSignatureExpired(timestamp: number, maxAge: number = 300000): boolean {
    return Date.now() - timestamp > maxAge;
  }
}

export const signatureValidator = new SignatureValidatorService();
