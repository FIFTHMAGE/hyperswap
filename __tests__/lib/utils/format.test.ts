import { formatCurrency, formatNumber, formatPercentage, formatCompact } from '@/lib/utils/format'

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(0.5)).toBe('50.00%')
      expect(formatPercentage(0.1234)).toBe('12.34%')
    })
  })

  describe('formatCompact', () => {
    it('should format large numbers compactly', () => {
      expect(formatCompact(1500)).toBe('1.5K')
      expect(formatCompact(1500000)).toBe('1.5M')
      expect(formatCompact(1500000000)).toBe('1.5B')
    })
  })
})

