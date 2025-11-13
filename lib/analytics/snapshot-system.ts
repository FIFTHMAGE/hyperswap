export interface PortfolioSnapshot {
  id: string;
  timestamp: string;
  totalValue: number;
  tokens: Array<{
    address: string;
    symbol: string;
    balance: number;
    value: number;
  }>;
  chains: Record<string, number>;
  metadata: {
    txCount: number;
    gasSpent: number;
  };
}

export class SnapshotSystem {
  private snapshots: Map<string, PortfolioSnapshot[]> = new Map();

  createSnapshot(walletAddress: string, data: Omit<PortfolioSnapshot, 'id' | 'timestamp'>): PortfolioSnapshot {
    const snapshot: PortfolioSnapshot = {
      ...data,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    const existing = this.snapshots.get(walletAddress) || [];
    existing.push(snapshot);
    this.snapshots.set(walletAddress, existing);

    return snapshot;
  }

  getSnapshots(walletAddress: string, limit?: number): PortfolioSnapshot[] {
    const snapshots = this.snapshots.get(walletAddress) || [];
    return limit ? snapshots.slice(-limit) : snapshots;
  }

  getSnapshotAtTime(walletAddress: string, timestamp: string): PortfolioSnapshot | null {
    const snapshots = this.snapshots.get(walletAddress) || [];
    return snapshots.find(s => s.timestamp === timestamp) || null;
  }

  compareSnapshots(snapshot1: PortfolioSnapshot, snapshot2: PortfolioSnapshot) {
    const valueDiff = snapshot2.totalValue - snapshot1.totalValue;
    const valueChange = snapshot1.totalValue > 0 
      ? (valueDiff / snapshot1.totalValue) * 100 
      : 0;

    return {
      valueDiff,
      valueChangePercent: valueChange,
      timeDiff: new Date(snapshot2.timestamp).getTime() - new Date(snapshot1.timestamp).getTime(),
      tokenCountChange: snapshot2.tokens.length - snapshot1.tokens.length,
    };
  }

  private generateId(): string {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

