/**
 * Token price service tests
 */

import { tokenPriceService } from '@/services/token/price.service';

describe('Token Price Service', () => {
  test('gets price', async () => {
    const price = await tokenPriceService.getPrice('0x123', 1);

    expect(typeof price).toBe('number');
    expect(price).toBeGreaterThan(0);
  });

  test('caches prices', async () => {
    const price1 = await tokenPriceService.getPrice('0x456', 1);
    const price2 = await tokenPriceService.getPrice('0x456', 1);

    expect(price1).toBe(price2);
  });

  test('gets multiple prices', async () => {
    const prices = await tokenPriceService.getPrices([
      { address: '0x123', chainId: 1 },
      { address: '0x456', chainId: 1 },
    ]);

    expect(prices.size).toBe(2);
    expect(prices.get('0x123')).toBeGreaterThan(0);
  });

  test('gets price history', async () => {
    const history = await tokenPriceService.getPriceHistory('0x123', 1, 7);

    expect(history).toHaveLength(7);
    expect(history[0]).toHaveProperty('timestamp');
    expect(history[0]).toHaveProperty('price');
  });
});
