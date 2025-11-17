/**
 * Wrapped export service for various formats
 */

export class WrappedExportService {
  async exportAsJSON(data: any): Promise<void> {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    this.download(blob, 'wrapped-2024.json');
  }

  async exportAsCSV(data: any): Promise<void> {
    let csv = 'Metric,Value\n';
    csv += `Total Transactions,${data.totalTransactions}\n`;
    csv += `Total Volume,${data.totalVolume}\n`;
    csv += `Total Gas,${data.totalGas}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    this.download(blob, 'wrapped-2024.csv');
  }

  async exportAsHTML(data: any): Promise<void> {
    const html = this.generateHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    this.download(blob, 'wrapped-2024.html');
  }

  private generateHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Crypto Wrapped 2024</title>
          <style>
            body { font-family: Arial; background: linear-gradient(to bottom right, #1e1b4b, #ec4899); color: white; padding: 40px; }
            .card { background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin: 20px 0; }
            h1 { font-size: 48px; }
            .stat { font-size: 36px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>My Crypto Wrapped 2024</h1>
          <div class="card">
            <div class="stat">${data.totalTransactions || 0}</div>
            <div>Transactions</div>
          </div>
          <div class="card">
            <div class="stat">$${(data.totalVolume || 0).toLocaleString()}</div>
            <div>Total Volume</div>
          </div>
        </body>
      </html>
    `;
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const wrappedExportService = new WrappedExportService();
