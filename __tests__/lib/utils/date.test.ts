import { formatDate, getRelativeTime, isToday, isYesterday } from '@/lib/utils/date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15')
    })
  })

  describe('getRelativeTime', () => {
    it('should return relative time strings', () => {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      expect(getRelativeTime(now.toISOString())).toContain('ago')
    })
  })

  describe('isToday', () => {
    it('should identify today correctly', () => {
      const today = new Date()
      expect(isToday(today.toISOString())).toBe(true)
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      expect(isToday(yesterday.toISOString())).toBe(false)
    })
  })

  describe('isYesterday', () => {
    it('should identify yesterday correctly', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      expect(isYesterday(yesterday.toISOString())).toBe(true)
    })
  })
})

