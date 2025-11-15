/**
 * IndexedDB service tests
 */

import { IndexedDBService } from '@/services/indexeddb/indexeddb.service';

describe('IndexedDBService', () => {
  let service: IndexedDBService;

  beforeEach(() => {
    service = new IndexedDBService('test-db', 1);
  });

  afterEach(() => {
    service.close();
  });

  test('creates service instance', () => {
    expect(service).toBeInstanceOf(IndexedDBService);
  });

  test('throws error when not initialized', async () => {
    await expect(service.get('store', 1)).rejects.toThrow('Database not initialized');
  });

  test('throws error when putting without initialization', async () => {
    await expect(service.put('store', { id: 1, data: 'test' })).rejects.toThrow(
      'Database not initialized'
    );
  });

  test('throws error when deleting without initialization', async () => {
    await expect(service.delete('store', 1)).rejects.toThrow('Database not initialized');
  });

  test('throws error when getting all without initialization', async () => {
    await expect(service.getAll('store')).rejects.toThrow('Database not initialized');
  });

  test('closes database connection', () => {
    expect(() => service.close()).not.toThrow();
  });
});
