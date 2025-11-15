/**
 * WebSocket service tests
 */

import { WebSocketService } from '@/services/websocket/websocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    service = new WebSocketService('ws://localhost:8080');
  });

  afterEach(() => {
    service.disconnect();
  });

  test('creates service instance', () => {
    expect(service).toBeInstanceOf(WebSocketService);
  });

  test('checks connection status', () => {
    expect(service.isConnected()).toBe(false);
  });

  test('throws error when sending without connection', () => {
    expect(() => service.send({ test: 'data' })).toThrow('WebSocket is not connected');
  });

  test('subscribes to messages', () => {
    const handler = jest.fn();
    const unsubscribe = service.onMessage(handler);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  test('subscribes to errors', () => {
    const handler = jest.fn();
    const unsubscribe = service.onError(handler);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });
});
