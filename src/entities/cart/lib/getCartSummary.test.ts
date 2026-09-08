import type { CartLineItem } from './getCartLineItems'
import { getCartSummary } from './getCartSummary'

describe('getCartSummary', () => {
  it('calculates total quantity and price', () => {
    const items = [
      { quantity: 2, totalPrice: 1180 },
      { quantity: 1, totalPrice: 590 },
    ] as CartLineItem[]

    expect(getCartSummary(items)).toEqual({
      totalItems: 3,
      totalPrice: 1770,
    })
  })

  it('returns zero totals for an empty cart', () => {
    expect(getCartSummary([])).toEqual({
      totalItems: 0,
      totalPrice: 0,
    })
  })
})
