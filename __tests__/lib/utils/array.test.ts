import { chunk, unique, groupBy, shuffle, sample } from '@/lib/utils/array'

describe('array utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]])
    })
  })

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })
  })

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ]
      const result = groupBy(items, 'type')
      expect(result.a).toHaveLength(2)
      expect(result.b).toHaveLength(1)
    })
  })

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffle(arr)
      expect(shuffled).toHaveLength(5)
      expect(shuffled).toContain(1)
    })
  })

  describe('sample', () => {
    it('should return random element', () => {
      const arr = [1, 2, 3, 4, 5]
      const sampled = sample(arr)
      expect(arr).toContain(sampled)
    })
  })
})

