import { getCartItemCount } from './getCartItemCount'

describe('getCartItemCount', () => {
  it('sums quantities for the header badge', () => {
    expect(getCartItemCount([{ quantity: 2 }, { quantity: 1 }])).toBe(3)
  })

  it('returns zero for an empty cart', () => {
    expect(getCartItemCount([])).toBe(0)
  })

  it('ignores invalid quantities from malformed API data', () => {
    expect(
      getCartItemCount([
        { quantity: 2 },
        { quantity: 0 },
        { quantity: -1 },
        { quantity: Number.NaN },
      ])
    ).toBe(2)
  })
})
