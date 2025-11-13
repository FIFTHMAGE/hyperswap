export interface TaxReport {
  shortTermGains: number;
  longTermGains: number;
  totalTaxableIncome: number;
  estimatedTax: number;
  jurisdiction: string;
}

export interface TaxableEvent {
  type: 'trade' | 'income' | 'gift';
  amount: number;
  costBasis: number;
  timestamp: string;
  holdingPeriod: number; // in days
}

export function calculateTaxLiability(
  events: TaxableEvent[],
  jurisdiction: 'US' | 'UK' | 'EU' = 'US'
): TaxReport {
  let shortTermGains = 0;
  let longTermGains = 0;
  let totalTaxableIncome = 0;

  const shortTermThreshold = jurisdiction === 'US' ? 365 : 365; // days

  events.forEach(event => {
    const gain = event.amount - event.costBasis;

    if (event.type === 'trade') {
      if (event.holdingPeriod < shortTermThreshold) {
        shortTermGains += gain;
      } else {
        longTermGains += gain;
      }
    } else if (event.type === 'income') {
      totalTaxableIncome += event.amount;
    }
  });

  // Simplified tax estimation
  let estimatedTax = 0;
  if (jurisdiction === 'US') {
    // Short-term: ordinary income rate (assume 24%)
    // Long-term: 15% capital gains rate
    estimatedTax = Math.max(0, shortTermGains * 0.24) + Math.max(0, longTermGains * 0.15);
  } else if (jurisdiction === 'UK') {
    // UK capital gains tax (20% for higher rate)
    estimatedTax = Math.max(0, (shortTermGains + longTermGains) * 0.20);
  } else {
    // EU average (varies by country)
    estimatedTax = Math.max(0, (shortTermGains + longTermGains) * 0.25);
  }

  return {
    shortTermGains,
    longTermGains,
    totalTaxableIncome,
    estimatedTax,
    jurisdiction,
  };
}

