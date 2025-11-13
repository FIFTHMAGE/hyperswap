/**
 * WebSocket ping/pong heartbeat mechanism
 */

export class PingPong {
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private missedPongs = 0;
  private maxMissedPongs = 3;

  constructor(
    private ws: WebSocket,
    private interval: number = 30000,
    private onConnectionLost?: () => void
  ) {}

  start(): void {
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, this.interval);
  }

  stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private sendPing(): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));

      this.pongTimeout = setTimeout(() => {
        this.missedPongs++;
        if (this.missedPongs >= this.maxMissedPongs) {
          this.handleConnectionLost();
        }
      }, 5000);
    }
  }

  receivedPong(): void {
    this.missedPongs = 0;
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private handleConnectionLost(): void {
    this.stop();
    this.onConnectionLost?.();
  }
}

