export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculateGrowth(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

export function sumValues(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

export function averageValue(values: number[]): number {
  if (values.length === 0) return 0;
  return sumValues(values) / values.length;
}

export function findMostCommon<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  
  const counts = items.reduce((acc, item) => {
    const key = String(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxCount = Math.max(...Object.values(counts));
  const mostCommon = Object.keys(counts).find(key => counts[key] === maxCount);
  
  return mostCommon ? (items.find(item => String(item) === mostCommon) ?? null) : null;
}

