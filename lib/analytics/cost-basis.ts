export interface CostBasis {
  method: 'FIFO' | 'LIFO' | 'HIFO' | 'Average';
  totalCost: number;
  totalProceeds: number;
  realizedGain: number;
  unrealizedGain: number;
}

export interface TokenTransaction {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

export function calculateCostBasis(
  transactions: TokenTransaction[],
  currentPrice: number,
  method: CostBasis['method'] = 'FIFO'
): CostBasis {
  let holdings: Array<{ amount: number; price: number }> = [];
  let totalCost = 0;
  let totalProceeds = 0;
  let realizedGain = 0;

  transactions.forEach(tx => {
    if (tx.type === 'buy') {
      holdings.push({ amount: tx.amount, price: tx.price });
      totalCost += tx.amount * tx.price;
    } else if (tx.type === 'sell') {
      let remainingToSell = tx.amount;
      totalProceeds += tx.amount * tx.price;

      // Sort holdings based on method
      if (method === 'LIFO') {
        holdings.reverse();
      } else if (method === 'HIFO') {
        holdings.sort((a, b) => b.price - a.price);
      }

      while (remainingToSell > 0 && holdings.length > 0) {
        const holding = holdings[0];
        const sellAmount = Math.min(remainingToSell, holding.amount);
        
        realizedGain += sellAmount * (tx.price - holding.price);
        holding.amount -= sellAmount;
        remainingToSell -= sellAmount;

        if (holding.amount <= 0) {
          holdings.shift();
        }
      }

      // Restore order for LIFO
      if (method === 'LIFO') {
        holdings.reverse();
      }
    }
  });

  // Calculate unrealized gain
  const remainingAmount = holdings.reduce((sum, h) => sum + h.amount, 0);
  const remainingCost = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);
  const currentValue = remainingAmount * currentPrice;
  const unrealizedGain = currentValue - remainingCost;

  return {
    method,
    totalCost,
    totalProceeds,
    realizedGain,
    unrealizedGain,
  };
}

