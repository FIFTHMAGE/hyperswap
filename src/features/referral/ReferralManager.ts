/**
 * Referral Manager
 * Handles referral codes, tracking, and rewards
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface ReferralCode {
  code: string;
  owner: string;
  createdAt: Date;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  rewardPercentage: number;
  totalRewards: string;
  active: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReferralUse {
  id: string;
  code: string;
  referrer: string;
  referee: string;
  transactionHash: string;
  rewardAmount: string;
  timestamp: Date;
}

const STORAGE_KEY_CODES = 'referral_codes';
const STORAGE_KEY_USES = 'referral_uses';
const DEFAULT_REWARD_PERCENTAGE = 0.1; // 0.1%

export class ReferralManager {
  private codes: Map<string, ReferralCode> = new Map();
  private uses: ReferralUse[] = [];
  private storageManager: StorageManager;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.storageManager = new StorageManager();
    this.loadData();
  }

  /**
   * Load data from storage
   */
  private loadData(): void {
    try {
      // Load codes
      const storedCodes = this.storageManager.get<ReferralCode[]>(STORAGE_KEY_CODES);
      if (storedCodes && Array.isArray(storedCodes)) {
        storedCodes.forEach((code) => {
          this.codes.set(code.code, {
            ...code,
            createdAt: new Date(code.createdAt),
            expiresAt: code.expiresAt ? new Date(code.expiresAt) : undefined,
          });
        });
      }

      // Load uses
      const storedUses = this.storageManager.get<ReferralUse[]>(STORAGE_KEY_USES);
      if (storedUses && Array.isArray(storedUses)) {
        this.uses = storedUses.map((use) => ({
          ...use,
          timestamp: new Date(use.timestamp),
        }));
      }
    } catch (error) {
      logger.error('Error loading referral data:', error);
    }
  }

  /**
   * Save data to storage
   */
  private saveData(): void {
    try {
      this.storageManager.set(STORAGE_KEY_CODES, Array.from(this.codes.values()));
      this.storageManager.set(STORAGE_KEY_USES, this.uses);
    } catch (error) {
      logger.error('Error saving referral data:', error);
    }
  }

  /**
   * Generate a unique referral code
   */
  generateCode(prefix: string = ''): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix.toUpperCase();

    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Ensure uniqueness
    if (this.codes.has(code)) {
      return this.generateCode(prefix);
    }

    return code;
  }

  /**
   * Create a new referral code
   */
  createReferralCode(
    owner: string,
    options: {
      customCode?: string;
      rewardPercentage?: number;
      usageLimit?: number;
      expiresIn?: number; // milliseconds
    } = {}
  ): string {
    const code = options.customCode || this.generateCode();

    // Validate code doesn't exist
    if (this.codes.has(code)) {
      throw new Error('Referral code already exists');
    }

    // Validate custom code format
    if (options.customCode && !/^[A-Z0-9]{4,12}$/.test(code)) {
      throw new Error('Invalid code format. Use 4-12 uppercase alphanumeric characters');
    }

    const referralCode: ReferralCode = {
      code,
      owner,
      createdAt: new Date(),
      expiresAt: options.expiresIn ? new Date(Date.now() + options.expiresIn) : undefined,
      usageLimit: options.usageLimit,
      usageCount: 0,
      rewardPercentage: options.rewardPercentage || DEFAULT_REWARD_PERCENTAGE,
      totalRewards: '0',
      active: true,
    };

    this.codes.set(code, referralCode);
    this.saveData();
    this.notifyListeners();

    return code;
  }

  /**
   * Validate and use a referral code
   */
  async useReferralCode(
    code: string,
    referee: string,
    transactionHash: string,
    transactionValue: string
  ): Promise<{ valid: boolean; rewardAmount?: string; error?: string }> {
    const referralCode = this.codes.get(code.toUpperCase());

    if (!referralCode) {
      return { valid: false, error: 'Invalid referral code' };
    }

    // Check if active
    if (!referralCode.active) {
      return { valid: false, error: 'Referral code is inactive' };
    }

    // Check expiration
    if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
      return { valid: false, error: 'Referral code has expired' };
    }

    // Check usage limit
    if (referralCode.usageLimit && referralCode.usageCount >= referralCode.usageLimit) {
      return { valid: false, error: 'Referral code usage limit reached' };
    }

    // Check self-referral
    if (referralCode.owner.toLowerCase() === referee.toLowerCase()) {
      return { valid: false, error: 'Cannot use your own referral code' };
    }

    // Calculate reward
    const rewardAmount = this.calculateReward(transactionValue, referralCode.rewardPercentage);

    // Record usage
    const use: ReferralUse = {
      id: this.generateId(),
      code: code.toUpperCase(),
      referrer: referralCode.owner,
      referee,
      transactionHash,
      rewardAmount,
      timestamp: new Date(),
    };

    this.uses.unshift(use);

    // Update code stats
    referralCode.usageCount++;
    referralCode.totalRewards = this.addRewards(referralCode.totalRewards, rewardAmount);

    this.saveData();
    this.notifyListeners();

    return { valid: true, rewardAmount };
  }

  /**
   * Calculate reward amount
   */
  private calculateReward(transactionValue: string, rewardPercentage: number): string {
    const value = parseFloat(transactionValue);
    const reward = value * (rewardPercentage / 100);
    return reward.toFixed(6);
  }

  /**
   * Add reward amounts (string arithmetic)
   */
  private addRewards(total: string, reward: string): string {
    const sum = parseFloat(total) + parseFloat(reward);
    return sum.toFixed(6);
  }

  /**
   * Get referral code details
   */
  getReferralCode(code: string): ReferralCode | undefined {
    return this.codes.get(code.toUpperCase());
  }

  /**
   * Get all codes for an owner
   */
  getUserCodes(owner: string): ReferralCode[] {
    return Array.from(this.codes.values()).filter(
      (code) => code.owner.toLowerCase() === owner.toLowerCase()
    );
  }

  /**
   * Get referral uses for a code
   */
  getCodeUses(code: string): ReferralUse[] {
    return this.uses.filter((use) => use.code === code.toUpperCase());
  }

  /**
   * Get referrals made by a user
   */
  getUserReferrals(owner: string): ReferralUse[] {
    return this.uses.filter((use) => use.referrer.toLowerCase() === owner.toLowerCase());
  }

  /**
   * Deactivate a referral code
   */
  deactivateCode(code: string, owner: string): void {
    const referralCode = this.codes.get(code.toUpperCase());

    if (!referralCode) {
      throw new Error('Referral code not found');
    }

    if (referralCode.owner.toLowerCase() !== owner.toLowerCase()) {
      throw new Error('Not authorized to deactivate this code');
    }

    referralCode.active = false;
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Reactivate a referral code
   */
  reactivateCode(code: string, owner: string): void {
    const referralCode = this.codes.get(code.toUpperCase());

    if (!referralCode) {
      throw new Error('Referral code not found');
    }

    if (referralCode.owner.toLowerCase() !== owner.toLowerCase()) {
      throw new Error('Not authorized to reactivate this code');
    }

    // Check if expired
    if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
      throw new Error('Cannot reactivate expired code');
    }

    referralCode.active = true;
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Get user statistics
   */
  getUserStats(owner: string): {
    totalCodes: number;
    activeCodes: number;
    totalReferrals: number;
    totalRewards: string;
    topCode?: { code: string; uses: number };
  } {
    const userCodes = this.getUserCodes(owner);
    const userReferrals = this.getUserReferrals(owner);

    const activeCodes = userCodes.filter((code) => code.active).length;
    const totalRewards = userCodes.reduce(
      (sum, code) => this.addRewards(sum, code.totalRewards),
      '0'
    );

    // Find top performing code
    const topCode = userCodes.reduce(
      (top, code) => {
        if (!top || code.usageCount > top.uses) {
          return { code: code.code, uses: code.usageCount };
        }
        return top;
      },
      undefined as { code: string; uses: number } | undefined
    );

    return {
      totalCodes: userCodes.length,
      activeCodes,
      totalReferrals: userReferrals.length,
      totalRewards,
      topCode,
    };
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): Array<{ owner: string; referrals: number; rewards: string }> {
    const leaderboard = new Map<string, { referrals: number; rewards: string }>();

    Array.from(this.codes.values()).forEach((code) => {
      const existing = leaderboard.get(code.owner);
      if (existing) {
        existing.referrals += code.usageCount;
        existing.rewards = this.addRewards(existing.rewards, code.totalRewards);
      } else {
        leaderboard.set(code.owner, {
          referrals: code.usageCount,
          rewards: code.totalRewards,
        });
      }
    });

    return Array.from(leaderboard.entries())
      .map(([owner, stats]) => ({ owner, ...stats }))
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, limit);
  }

  /**
   * Get recent referral activity
   */
  getRecentActivity(limit: number = 10): ReferralUse[] {
    return this.uses.slice(0, limit);
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        logger.error('Error notifying referral listener:', error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get global statistics
   */
  getGlobalStats(): {
    totalCodes: number;
    activeCodes: number;
    totalUses: number;
    totalRewards: string;
  } {
    const activeCodes = Array.from(this.codes.values()).filter((code) => code.active).length;
    const totalRewards = Array.from(this.codes.values()).reduce(
      (sum, code) => this.addRewards(sum, code.totalRewards),
      '0'
    );

    return {
      totalCodes: this.codes.size,
      activeCodes,
      totalUses: this.uses.length,
      totalRewards,
    };
  }

  /**
   * Export data
   */
  export(): { codes: ReferralCode[]; uses: ReferralUse[] } {
    return {
      codes: Array.from(this.codes.values()),
      uses: this.uses,
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.codes.clear();
    this.uses = [];
    this.saveData();
    this.notifyListeners();
  }
}

// Singleton instance
export const referralManager = new ReferralManager();
