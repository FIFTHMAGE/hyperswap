/**
 * JSON export service
 * @module services/export
 */

class JSONExportService {
  exportToJSON(data: unknown, filename: string, pretty: boolean = true): void {
    const jsonContent = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

    this.downloadFile(jsonContent, filename, 'application/json');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}

export const jsonExportService = new JSONExportService();
