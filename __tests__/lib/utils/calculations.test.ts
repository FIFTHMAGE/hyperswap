import { calculatePercentageChange, calculateAverage, calculateMedian, calculateSum } from '@/lib/utils/calculations'

describe('calculations utilities', () => {
  describe('calculatePercentageChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50)
      expect(calculatePercentageChange(200, 100)).toBe(-50)
      expect(calculatePercentageChange(0, 100)).toBe(0)
    })
  })

  describe('calculateAverage', () => {
    it('should calculate average of numbers', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3)
      expect(calculateAverage([10, 20, 30])).toBe(20)
      expect(calculateAverage([])).toBe(0)
    })
  })

  describe('calculateMedian', () => {
    it('should calculate median correctly', () => {
      expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3)
      expect(calculateMedian([1, 2, 3, 4])).toBe(2.5)
    })
  })

  describe('calculateSum', () => {
    it('should sum array of numbers', () => {
      expect(calculateSum([1, 2, 3, 4, 5])).toBe(15)
      expect(calculateSum([])).toBe(0)
    })
  })
})

