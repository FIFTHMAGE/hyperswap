/**
 * Quote service tests
 */

import { quoteService } from '@/services/swap/quote.service';

describe('Quote Service', () => {
  test('gets quote', async () => {
    const quote = await quoteService.getQuote({
      fromToken: '0x123',
      toToken: '0x456',
      amount: '100',
      chainId: 1,
    });

    expect(quote).toBeDefined();
    expect(quote.fromToken).toBe('0x123');
    expect(quote.toToken).toBe('0x456');
    expect(quote.fromAmount).toBe('100');
  });

  test('gets multiple quotes', async () => {
    const quotes = await quoteService.getMultipleQuotes({
      fromToken: '0x123',
      toToken: '0x456',
      amount: '100',
      chainId: 1,
    });

    expect(quotes).toHaveLength(2);
    expect(quotes[0].fromToken).toBe('0x123');
  });
});
