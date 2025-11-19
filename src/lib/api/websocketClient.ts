export class WebSocketClient {
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => console.log('Connected');
    this.ws.onmessage = (event) => console.log('Message:', event.data);
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.ws?.close();
  }
}
