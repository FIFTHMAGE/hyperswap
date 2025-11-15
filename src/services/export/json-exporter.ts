import { WalletWrappedStats } from '@/lib/types/wrapped';

export function exportToJSON(stats: WalletWrappedStats, filename?: string): void {
  const dataStr = JSON.stringify(stats, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `wallet-wrapped-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function parseJSONExport(json: string): WalletWrappedStats | null {
  try {
    return JSON.parse(json) as WalletWrappedStats;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

