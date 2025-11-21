/**
 * HistoryManager - Manage user action history
 * @module features/history
 */

import { Logger } from '../../utils/logger';

const logger = new Logger('HistoryManager');

export enum HistoryActionType {
  SWAP = 'swap',
  LIQUIDITY_ADD = 'liquidity_add',
  LIQUIDITY_REMOVE = 'liquidity_remove',
  TOKEN_APPROVAL = 'token_approval',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  SETTINGS_CHANGE = 'settings_change',
}

export interface HistoryAction {
  id: string;
  type: HistoryActionType;
  timestamp: number;
  data: Record<string, any>;
  chainId?: number;
  txHash?: string;
}

export class HistoryManager {
  private history: HistoryAction[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Record action in history
   */
  recordAction(
    type: HistoryActionType,
    data: Record<string, any>,
    chainId?: number,
    txHash?: string
  ): void {
    const action: HistoryAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      data,
      chainId,
      txHash,
    };

    this.history.unshift(action);

    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }

    logger.debug(`Recorded action: ${type}`);
  }

  /**
   * Get all history
   */
  getHistory(): HistoryAction[] {
    return [...this.history];
  }

  /**
   * Get history by type
   */
  getHistoryByType(type: HistoryActionType): HistoryAction[] {
    return this.history.filter((action) => action.type === type);
  }

  /**
   * Get history by chain
   */
  getHistoryByChain(chainId: number): HistoryAction[] {
    return this.history.filter((action) => action.chainId === chainId);
  }

  /**
   * Get recent history
   */
  getRecentHistory(limit: number = 10): HistoryAction[] {
    return this.history.slice(0, limit);
  }

  /**
   * Get history in date range
   */
  getHistoryInRange(startDate: Date, endDate: Date): HistoryAction[] {
    const start = startDate.getTime();
    const end = endDate.getTime();

    return this.history.filter((action) => action.timestamp >= start && action.timestamp <= end);
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
    logger.info('History cleared');
  }

  /**
   * Clear old history
   */
  clearOldHistory(olderThanDays: number = 30): void {
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    this.history = this.history.filter((action) => action.timestamp >= cutoffTime);
    logger.info(`Cleared history older than ${olderThanDays} days`);
  }

  /**
   * Get history statistics
   */
  getStatistics(): {
    total: number;
    byType: Record<HistoryActionType, number>;
    lastAction?: HistoryAction;
  } {
    const stats = {
      total: this.history.length,
      byType: {
        [HistoryActionType.SWAP]: 0,
        [HistoryActionType.LIQUIDITY_ADD]: 0,
        [HistoryActionType.LIQUIDITY_REMOVE]: 0,
        [HistoryActionType.TOKEN_APPROVAL]: 0,
        [HistoryActionType.WALLET_CONNECT]: 0,
        [HistoryActionType.WALLET_DISCONNECT]: 0,
        [HistoryActionType.SETTINGS_CHANGE]: 0,
      },
      lastAction: this.history[0],
    };

    this.history.forEach((action) => {
      stats.byType[action.type]++;
    });

    return stats;
  }

  /**
   * Export history
   */
  exportHistory(): HistoryAction[] {
    return this.getHistory();
  }

  /**
   * Import history
   */
  importHistory(actions: HistoryAction[]): void {
    this.history = actions.sort((a, b) => b.timestamp - a.timestamp);
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
    logger.info(`Imported ${actions.length} history actions`);
  }
}

export const historyManager = new HistoryManager();
