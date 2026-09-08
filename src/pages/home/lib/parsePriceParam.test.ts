import { parsePriceParam } from './parsePriceParam'

describe('parsePriceParam', () => {
  it('returns a non-negative finite price', () => {
    expect(parsePriceParam('1490')).toBe(1490)
  })

  it('rejects invalid and negative prices', () => {
    expect(parsePriceParam('not-a-price')).toBeUndefined()
    expect(parsePriceParam('-1')).toBeUndefined()
  })
})
