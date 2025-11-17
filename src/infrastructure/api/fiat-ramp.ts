/**
 * Fiat on/off ramp integration
 */

export interface FiatRampProvider {
  name: string;
  supportedMethods: ('card' | 'bank' | 'wallet')[];
  fees: { percentage: number; fixed: number };
  limits: { min: number; max: number };
}

export class FiatRampService {
  getProviders(): FiatRampProvider[] {
    return [
      {
        name: 'Moonpay',
        supportedMethods: ['card', 'bank'],
        fees: { percentage: 4.5, fixed: 0 },
        limits: { min: 30, max: 20000 },
      },
      {
        name: 'Ramp',
        supportedMethods: ['card', 'bank', 'wallet'],
        fees: { percentage: 2.9, fixed: 0 },
        limits: { min: 50, max: 10000 },
      },
    ];
  }

  async initiatePurchase(provider: string, amount: number, currency: string): Promise<string> {
    return `https://${provider}.com/buy?amount=${amount}&currency=${currency}`;
  }
}

export const fiatRampService = new FiatRampService();
