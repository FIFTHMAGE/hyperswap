export interface Anomaly {
  type: 'unusual-volume' | 'unusual-timing' | 'unusual-token' | 'suspicious-contract';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  details: Record<string, any>;
}

export function detectAnomalies(
  transactions: Array<{
    value: number;
    timestamp: string;
    tokenAddress?: string;
    to?: string;
  }>,
  avgTransactionValue: number,
  normalTokens: Set<string>
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  transactions.forEach((tx, index) => {
    // Unusual volume detection
    if (tx.value > avgTransactionValue * 10) {
      anomalies.push({
        type: 'unusual-volume',
        severity: tx.value > avgTransactionValue * 50 ? 'high' : 'medium',
        description: `Transaction ${(tx.value / avgTransactionValue).toFixed(1)}x larger than average`,
        timestamp: tx.timestamp,
        details: {
          value: tx.value,
          avgValue: avgTransactionValue,
        },
      });
    }

    // Unusual timing detection (multiple transactions in short period)
    if (index > 0) {
      const prevTx = transactions[index - 1];
      const timeDiff = new Date(tx.timestamp).getTime() - new Date(prevTx.timestamp).getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff < 5 && tx.value > avgTransactionValue * 2) {
        anomalies.push({
          type: 'unusual-timing',
          severity: 'medium',
          description: `Multiple large transactions within ${minutesDiff.toFixed(1)} minutes`,
          timestamp: tx.timestamp,
          details: {
            timeDiff: minutesDiff,
            value: tx.value,
          },
        });
      }
    }

    // Unusual token detection
    if (tx.tokenAddress && !normalTokens.has(tx.tokenAddress)) {
      anomalies.push({
        type: 'unusual-token',
        severity: 'low',
        description: 'Transaction with unfamiliar token',
        timestamp: tx.timestamp,
        details: {
          tokenAddress: tx.tokenAddress,
        },
      });
    }
  });

  return anomalies;
}

