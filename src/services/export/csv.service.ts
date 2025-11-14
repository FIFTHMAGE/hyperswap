/**
 * CSV export service
 * @module services/export/csv
 */

/**
 * Convert array of objects to CSV string
 */
export function toCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  const keys = headers || Object.keys(data[0]);
  
  // CSV header
  const csvHeaders = keys.map(escapeCSVValue).join(',');
  
  // CSV rows
  const csvRows = data.map(row => {
    return keys.map(key => escapeCSVValue(row[key])).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Escape CSV value
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Download CSV file
 */
export function downloadCSV(data: any[], filename: string = 'export.csv', headers?: string[]): void {
  const csv = toCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: any[]): void {
  const headers = ['Date', 'Type', 'Token', 'Amount', 'Value USD', 'Hash'];
  
  const formattedData = transactions.map(tx => ({
    Date: new Date(tx.timestamp * 1000).toLocaleDateString(),
    Type: tx.type || 'Transfer',
    Token: tx.token?.symbol || 'Unknown',
    Amount: tx.amount || '0',
    'Value USD': tx.valueUSD ? `$${tx.valueUSD.toFixed(2)}` : '-',
    Hash: tx.hash,
  }));

  downloadCSV(formattedData, 'transactions.csv', headers);
}

/**
 * Export portfolio to CSV
 */
export function exportPortfolioToCSV(tokens: any[]): void {
  const headers = ['Token', 'Symbol', 'Balance', 'Price USD', 'Value USD'];
  
  const formattedData = tokens.map(token => ({
    Token: token.name,
    Symbol: token.symbol,
    Balance: token.balanceFormatted || '0',
    'Price USD': token.priceUSD ? `$${token.priceUSD.toFixed(2)}` : '-',
    'Value USD': token.balanceUSD ? `$${token.balanceUSD.toFixed(2)}` : '-',
  }));

  downloadCSV(formattedData, 'portfolio.csv', headers);
}

/**
 * Export liquidity pools to CSV
 */
export function exportPoolsToCSV(pools: any[]): void {
  const headers = ['Pool', 'TVL', 'Volume 24h', 'APY', 'Fees 24h'];
  
  const formattedData = pools.map(pool => ({
    Pool: `${pool.token0.symbol}/${pool.token1.symbol}`,
    TVL: pool.tvl ? `$${pool.tvl.toFixed(2)}` : '-',
    'Volume 24h': pool.volume24h ? `$${pool.volume24h.toFixed(2)}` : '-',
    APY: pool.apy ? `${pool.apy.toFixed(2)}%` : '-',
    'Fees 24h': pool.fees24h ? `$${pool.fees24h.toFixed(2)}` : '-',
  }));

  downloadCSV(formattedData, 'liquidity-pools.csv', headers);
}

