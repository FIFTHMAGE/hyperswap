/**
 * Referral Manager
 * Handles referral program and reward tracking
 */

import logger from '../../utils/logger';
import { StorageManager } from '../storage/StorageManager';

export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  refereeId: string;
  code: string;
  rewardAmount: string;
  rewardToken: string;
  transactionHash?: string;
  claimedAt?: Date;
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: string;
  claimedRewards: string;
  pendingRewards: string;
  conversionRate: number;
}

const STORAGE_KEY_CODES = 'hyperswap_referral_codes';
const STORAGE_KEY_REWARDS = 'hyperswap_referral_rewards';
const DEFAULT_REWARD_PERCENTAGE = 0.1; // 10% of trading fees

export class ReferralManager {
  private static instance: ReferralManager;
  private codes: Map<string, ReferralCode> = new Map();
  private rewards: ReferralReward[] = [];
  private storageManager: StorageManager;
  private listeners: Set<() => void> = new Set();

  private constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.loadData();
    logger.info('ReferralManager initialized.');
  }

  public static getInstance(storageManager: StorageManager): ReferralManager {
    if (!ReferralManager.instance) {
      ReferralManager.instance = new ReferralManager(storageManager);
    }
    return ReferralManager.instance;
  }

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

      // Load rewards
      const storedRewards = this.storageManager.get<ReferralReward[]>(STORAGE_KEY_REWARDS);
      if (storedRewards && Array.isArray(storedRewards)) {
        this.rewards = storedRewards.map((reward) => ({
          ...reward,
          createdAt: new Date(reward.createdAt),
          claimedAt: reward.claimedAt ? new Date(reward.claimedAt) : undefined,
        }));
      }
    } catch (error) {
      logger.error('Failed to load referral data from storage:', error);
    }
  }

  private saveData(): void {
    try {
      this.storageManager.set(STORAGE_KEY_CODES, Array.from(this.codes.values()));
      this.storageManager.set(STORAGE_KEY_REWARDS, this.rewards);
      logger.debug('Referral data saved to storage.');
    } catch (error) {
      logger.error('Failed to save referral data to storage:', error);
    }
  }

  /**
   * Generate a unique referral code
   */
  private generateCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Ensure uniqueness
    if (this.codes.has(code)) {
      return this.generateCode();
    }

    return code;
  }

  /**
   * Create a new referral code
   */
  createReferralCode(
    userId: string,
    options: {
      customCode?: string;
      expiresIn?: number; // days
      usageLimit?: number;
    } = {}
  ): string {
    const code = options.customCode || this.generateCode();

    if (this.codes.has(code)) {
      throw new Error('Referral code already exists');
    }

    const now = new Date();
    const expiresAt = options.expiresIn
      ? new Date(now.getTime() + options.expiresIn * 24 * 60 * 60 * 1000)
      : undefined;

    const referralCode: ReferralCode = {
      code,
      userId,
      createdAt: now,
      expiresAt,
      usageLimit: options.usageLimit,
      usageCount: 0,
      isActive: true,
    };

    this.codes.set(code, referralCode);
    this.saveData();
    this.notifyListeners();

    logger.info(`Referral code created: ${code} for user ${userId}`);
    return code;
  }

  /**
   * Validate and use a referral code
   */
  useReferralCode(code: string, refereeId: string): boolean {
    const referralCode = this.codes.get(code);

    if (!referralCode) {
      logger.warn(`Referral code not found: ${code}`);
      return false;
    }

    if (!referralCode.isActive) {
      logger.warn(`Referral code inactive: ${code}`);
      return false;
    }

    // Check expiration
    if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
      logger.warn(`Referral code expired: ${code}`);
      this.deactivateCode(code);
      return false;
    }

    // Check usage limit
    if (referralCode.usageLimit && referralCode.usageCount >= referralCode.usageLimit) {
      logger.warn(`Referral code usage limit reached: ${code}`);
      this.deactivateCode(code);
      return false;
    }

    // Check self-referral
    if (referralCode.userId === refereeId) {
      logger.warn(`Self-referral attempted: ${code}`);
      return false;
    }

    // Increment usage count
    referralCode.usageCount++;
    this.saveData();
    this.notifyListeners();

    logger.info(`Referral code used: ${code} by ${refereeId}`);
    return true;
  }

  /**
   * Create a reward for successful referral
   */
  createReward(code: string, refereeId: string, tradingFee: string, token: string): string {
    const referralCode = this.codes.get(code);

    if (!referralCode) {
      throw new Error('Referral code not found');
    }

    const rewardAmount = (parseFloat(tradingFee) * DEFAULT_REWARD_PERCENTAGE).toFixed(6);

    const reward: ReferralReward = {
      id: crypto.randomUUID(),
      referrerId: referralCode.userId,
      refereeId,
      code,
      rewardAmount,
      rewardToken: token,
      createdAt: new Date(),
    };

    this.rewards.push(reward);
    this.saveData();
    this.notifyListeners();

    logger.info(
      `Reward created: ${reward.id} (${rewardAmount} ${token}) for referrer ${referralCode.userId}`
    );
    return reward.id;
  }

  /**
   * Claim a reward
   */
  claimReward(rewardId: string, transactionHash: string): boolean {
    const reward = this.rewards.find((r) => r.id === rewardId);

    if (!reward) {
      logger.warn(`Reward not found: ${rewardId}`);
      return false;
    }

    if (reward.claimedAt) {
      logger.warn(`Reward already claimed: ${rewardId}`);
      return false;
    }

    reward.claimedAt = new Date();
    reward.transactionHash = transactionHash;
    this.saveData();
    this.notifyListeners();

    logger.info(`Reward claimed: ${rewardId}`);
    return true;
  }

  /**
   * Get referral code by code string
   */
  getCode(code: string): ReferralCode | undefined {
    return this.codes.get(code);
  }

  /**
   * Get all codes for a user
   */
  getUserCodes(userId: string): ReferralCode[] {
    return Array.from(this.codes.values()).filter((code) => code.userId === userId);
  }

  /**
   * Get active codes for a user
   */
  getActiveUserCodes(userId: string): ReferralCode[] {
    return this.getUserCodes(userId).filter((code) => code.isActive);
  }

  /**
   * Get rewards for a referrer
   */
  getReferrerRewards(referrerId: string): ReferralReward[] {
    return this.rewards.filter((reward) => reward.referrerId === referrerId);
  }

  /**
   * Get pending rewards
   */
  getPendingRewards(referrerId: string): ReferralReward[] {
    return this.rewards.filter((reward) => reward.referrerId === referrerId && !reward.claimedAt);
  }

  /**
   * Get claimed rewards
   */
  getClaimedRewards(referrerId: string): ReferralReward[] {
    return this.rewards.filter((reward) => reward.referrerId === referrerId && reward.claimedAt);
  }

  /**
   * Get referral statistics
   */
  getStats(userId: string): ReferralStats {
    const userRewards = this.getReferrerRewards(userId);
    const pendingRewards = userRewards.filter((r) => !r.claimedAt);
    const claimedRewards = userRewards.filter((r) => r.claimedAt);

    const totalRewards = userRewards.reduce((sum, r) => sum + parseFloat(r.rewardAmount), 0);

    const claimed = claimedRewards.reduce((sum, r) => sum + parseFloat(r.rewardAmount), 0);

    const pending = pendingRewards.reduce((sum, r) => sum + parseFloat(r.rewardAmount), 0);

    const userCodes = this.getUserCodes(userId);
    const totalUsage = userCodes.reduce((sum, code) => sum + code.usageCount, 0);
    const activeReferrals = totalUsage; // Simplified

    return {
      totalReferrals: totalUsage,
      activeReferrals,
      totalRewards: totalRewards.toFixed(6),
      claimedRewards: claimed.toFixed(6),
      pendingRewards: pending.toFixed(6),
      conversionRate: totalUsage > 0 ? (activeReferrals / totalUsage) * 100 : 0,
    };
  }

  /**
   * Deactivate a referral code
   */
  deactivateCode(code: string): boolean {
    const referralCode = this.codes.get(code);

    if (!referralCode) {
      return false;
    }

    referralCode.isActive = false;
    this.saveData();
    this.notifyListeners();

    logger.info(`Referral code deactivated: ${code}`);
    return true;
  }

  /**
   * Reactivate a referral code
   */
  reactivateCode(code: string): boolean {
    const referralCode = this.codes.get(code);

    if (!referralCode) {
      return false;
    }

    // Check expiration
    if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
      logger.warn(`Cannot reactivate expired code: ${code}`);
      return false;
    }

    referralCode.isActive = true;
    this.saveData();
    this.notifyListeners();

    logger.info(`Referral code reactivated: ${code}`);
    return true;
  }

  /**
   * Delete a referral code
   */
  deleteCode(code: string): boolean {
    const deleted = this.codes.delete(code);

    if (deleted) {
      this.saveData();
      this.notifyListeners();
      logger.info(`Referral code deleted: ${code}`);
    }

    return deleted;
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): Array<{
    userId: string;
    totalReferrals: number;
    totalRewards: string;
  }> {
    const userMap = new Map<string, { referrals: number; rewards: number }>();

    // Aggregate data
    this.codes.forEach((code) => {
      if (!userMap.has(code.userId)) {
        userMap.set(code.userId, { referrals: 0, rewards: 0 });
      }
      const userData = userMap.get(code.userId)!;
      userData.referrals += code.usageCount;
    });

    this.rewards.forEach((reward) => {
      if (!userMap.has(reward.referrerId)) {
        userMap.set(reward.referrerId, { referrals: 0, rewards: 0 });
      }
      const userData = userMap.get(reward.referrerId)!;
      userData.rewards += parseFloat(reward.rewardAmount);
    });

    // Convert to array and sort
    const leaderboard = Array.from(userMap.entries())
      .map(([userId, data]) => ({
        userId,
        totalReferrals: data.referrals,
        totalRewards: data.rewards.toFixed(6),
      }))
      .sort((a, b) => b.totalReferrals - a.totalReferrals)
      .slice(0, limit);

    return leaderboard;
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
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
   * Clean up expired codes
   */
  cleanupExpiredCodes(): number {
    const now = new Date();
    let cleaned = 0;

    this.codes.forEach((code) => {
      if (code.expiresAt && now > code.expiresAt && code.isActive) {
        code.isActive = false;
        cleaned++;
      }
    });

    if (cleaned > 0) {
      this.saveData();
      this.notifyListeners();
      logger.info(`Cleaned up ${cleaned} expired referral codes`);
    }

    return cleaned;
  }

  /**
   * Export referral data
   */
  exportData(): {
    codes: ReferralCode[];
    rewards: ReferralReward[];
  } {
    return {
      codes: Array.from(this.codes.values()),
      rewards: [...this.rewards],
    };
  }
}

// Singleton instance
export const referralManager = ReferralManager.getInstance(StorageManager.getInstance());
