import { truncate, capitalize, titleCase, slugify, randomString } from '@/lib/utils/string'

describe('string utilities', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
      expect(truncate('Short', 10)).toBe('Short')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
    })
  })

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World')
      expect(titleCase('the quick brown fox')).toBe('The Quick Brown Fox')
    })
  })

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test @#$ String')).toBe('test-string')
    })
  })

  describe('randomString', () => {
    it('should generate random strings of specified length', () => {
      const str = randomString(10)
      expect(str).toHaveLength(10)
      expect(typeof str).toBe('string')
    })
  })
})

