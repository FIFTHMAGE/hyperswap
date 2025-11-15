/**
 * WebSocket Message Compression
 * Optimizes data transfer by compressing/decompressing messages
 */

export interface CompressionConfig {
  enabled: boolean;
  threshold: number; // Min size in bytes to compress
  algorithm: 'gzip' | 'deflate' | 'brotli';
}

const DEFAULT_CONFIG: CompressionConfig = {
  enabled: true,
  threshold: 1024, // 1KB
  algorithm: 'gzip',
};

/**
 * Compresses a string message using the specified algorithm
 */
export async function compressMessage(
  message: string,
  config: CompressionConfig = DEFAULT_CONFIG
): Promise<ArrayBuffer | string> {
  if (!config.enabled || message.length < config.threshold) {
    return message;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Use CompressionStream if available
    if ('CompressionStream' in window) {
      const stream = new CompressionStream(config.algorithm);
      const writer = stream.writable.getWriter();
      await writer.write(data);
      await writer.close();

      const reader = stream.readable.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // Concatenate chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const compressed = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }

      return compressed.buffer;
    }

    // Fallback: return original message
    return message;
  } catch (error) {
    console.error('Compression error:', error);
    return message;
  }
}

/**
 * Decompresses a message received from WebSocket
 */
export async function decompressMessage(
  data: ArrayBuffer | string,
  config: CompressionConfig = DEFAULT_CONFIG
): Promise<string> {
  if (typeof data === 'string' || !config.enabled) {
    return typeof data === 'string' ? data : new TextDecoder().decode(data);
  }

  try {
    // Use DecompressionStream if available
    if ('DecompressionStream' in window) {
      const stream = new DecompressionStream(config.algorithm);
      const writer = stream.writable.getWriter();
      await writer.write(new Uint8Array(data));
      await writer.close();

      const reader = stream.readable.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // Concatenate and decode
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const decompressed = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        decompressed.set(chunk, offset);
        offset += chunk.length;
      }

      return new TextDecoder().decode(decompressed);
    }

    // Fallback
    return new TextDecoder().decode(data);
  } catch (error) {
    console.error('Decompression error:', error);
    return new TextDecoder().decode(data);
  }
}

/**
 * Estimates compression ratio for a message
 */
export function estimateCompressionRatio(message: string): number {
  const originalSize = new TextEncoder().encode(message).length;
  
  // Simple estimation based on JSON structure
  // Real compression depends on data patterns
  const jsonMatch = message.match(/[{}\[\]:,"]/g);
  const redundancy = jsonMatch ? jsonMatch.length / message.length : 0.3;
  
  // Typical compression ratios: 30-70% reduction
  return Math.max(0.3, 1 - redundancy * 0.7);
}

/**
 * Batch multiple messages before compression
 */
export class MessageBatcher {
  private batch: string[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly maxBatchSize: number;
  private readonly maxWaitMs: number;
  private readonly onFlush: (messages: string[]) => void;

  constructor(
    onFlush: (messages: string[]) => void,
    maxBatchSize = 10,
    maxWaitMs = 100
  ) {
    this.onFlush = onFlush;
    this.maxBatchSize = maxBatchSize;
    this.maxWaitMs = maxWaitMs;
  }

  add(message: string): void {
    this.batch.push(message);

    if (this.batch.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.maxWaitMs);
    }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.batch.length > 0) {
      this.onFlush([...this.batch]);
      this.batch = [];
    }
  }

  destroy(): void {
    this.flush();
  }
}

/**
 * Compression statistics tracker
 */
export class CompressionStats {
  private totalOriginal = 0;
  private totalCompressed = 0;
  private messageCount = 0;

  record(originalSize: number, compressedSize: number): void {
    this.totalOriginal += originalSize;
    this.totalCompressed += compressedSize;
    this.messageCount++;
  }

  getStats() {
    const ratio = this.totalOriginal > 0 
      ? this.totalCompressed / this.totalOriginal 
      : 1;
    const saved = this.totalOriginal - this.totalCompressed;
    const savedPercent = this.totalOriginal > 0 
      ? (saved / this.totalOriginal) * 100 
      : 0;

    return {
      totalOriginal: this.totalOriginal,
      totalCompressed: this.totalCompressed,
      messageCount: this.messageCount,
      compressionRatio: ratio,
      bytesSaved: saved,
      percentSaved: savedPercent,
      averageOriginal: this.messageCount > 0 
        ? this.totalOriginal / this.messageCount 
        : 0,
      averageCompressed: this.messageCount > 0 
        ? this.totalCompressed / this.messageCount 
        : 0,
    };
  }

  reset(): void {
    this.totalOriginal = 0;
    this.totalCompressed = 0;
    this.messageCount = 0;
  }
}
