/**
 * Impermanent loss calculator
 * @module components/liquidity/ImpermanentLossCalculator
 */

'use client';

import { useState } from 'react';
import { styled } from 'nativewind';
import { Card, NumberInput, Button } from '../ui';
import { formatPercentage, formatUSD } from '@/utils/format/currency';

const ImpermanentLossCalculator: React.FC = () => {
  const [initialPrice, setInitialPrice] = useState('1');
  const [currentPrice, setCurrentPrice] = useState('1');
  const [investmentAmount, setInvestmentAmount] = useState('10000');

  const calculateIL = () => {
    const p0 = parseFloat(initialPrice);
    const p1 = parseFloat(currentPrice);
    
    if (isNaN(p0) || isNaN(p1) || p0 <= 0 || p1 <= 0) return null;

    const priceRatio = p1 / p0;
    const ilRatio = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
    const ilPercent = ilRatio * 100;

    const investment = parseFloat(investmentAmount);
    if (isNaN(investment)) return null;

    const ilAmount = investment * Math.abs(ilRatio);

    return {
      percent: ilPercent,
      amount: ilAmount,
      priceChange: ((p1 - p0) / p0) * 100,
    };
  };

  const result = calculateIL();

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold mb-6">Impermanent Loss Calculator</h2>

      <div className="space-y-4 mb-6">
        <NumberInput
          label="Initial Token Price"
          value={initialPrice}
          onChange={setInitialPrice}
          placeholder="1.0"
          fullWidth
        />

        <NumberInput
          label="Current Token Price"
          value={currentPrice}
          onChange={setCurrentPrice}
          placeholder="1.0"
          fullWidth
        />

        <NumberInput
          label="Investment Amount (USD)"
          value={investmentAmount}
          onChange={setInvestmentAmount}
          placeholder="10000"
          fullWidth
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Price Change</span>
              <span className={`font-semibold ${result.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.priceChange >= 0 ? '+' : ''}{formatPercentage(result.priceChange / 100)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Impermanent Loss</span>
              <span className="font-semibold text-red-600">
                {formatPercentage(result.percent / 100)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">IL Amount</span>
              <span className="font-semibold text-red-600">
                {formatUSD(result.amount)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-2">What is Impermanent Loss?</p>
            <p>
              Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when you deposited them. 
              The loss is "impermanent" because it could be recovered if prices return to their original ratio.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default styled(ImpermanentLossCalculator);

