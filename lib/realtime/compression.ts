/**
 * WebSocket message compression utilities
 */

export class MessageCompression {
  static compress(data: any): string {
    // Simple JSON compression (in production, use pako or similar)
    const json = JSON.stringify(data);
    return btoa(json);
  }

  static decompress(compressed: string): any {
    try {
      const json = atob(compressed);
      return JSON.parse(json);
    } catch (error) {
      console.error('Decompression failed:', error);
      return null;
    }
  }

  static shouldCompress(data: any): boolean {
    const size = new Blob([JSON.stringify(data)]).size;
    return size > 1024; // Compress if larger than 1KB
  }
}

