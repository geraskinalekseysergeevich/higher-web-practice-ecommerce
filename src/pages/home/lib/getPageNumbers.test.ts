import { getPageNumbers } from './getPageNumbers'

describe('getPageNumbers', () => {
  it('returns the first, current and last pages without duplicates', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, 4, 5, 6, 10])
  })

  it('removes pages outside the available range', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3])
  })
})
