import { clamp, random, randomInt, roundTo, percentage, lerp } from '@/lib/utils/number'

describe('number utilities', () => {
  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('random', () => {
    it('should generate random numbers in range', () => {
      const num = random(0, 100)
      expect(num).toBeGreaterThanOrEqual(0)
      expect(num).toBeLessThanOrEqual(100)
    })
  })

  describe('randomInt', () => {
    it('should generate random integers in range', () => {
      const num = randomInt(1, 10)
      expect(Number.isInteger(num)).toBe(true)
      expect(num).toBeGreaterThanOrEqual(1)
      expect(num).toBeLessThanOrEqual(10)
    })
  })

  describe('roundTo', () => {
    it('should round to specified decimals', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14)
      expect(roundTo(3.14159, 4)).toBe(3.1416)
    })
  })

  describe('percentage', () => {
    it('should calculate percentages', () => {
      expect(percentage(50, 100)).toBe(50)
      expect(percentage(25, 200)).toBe(12.5)
      expect(percentage(10, 0)).toBe(0)
    })
  })

  describe('lerp', () => {
    it('should linear interpolate between values', () => {
      expect(lerp(0, 100, 0.5)).toBe(50)
      expect(lerp(0, 100, 0)).toBe(0)
      expect(lerp(0, 100, 1)).toBe(100)
    })
  })
})

