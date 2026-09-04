import { parseCart, parseProducts } from './validation'

describe('API response validation', () => {
  it('rejects malformed resource lists', () => {
    expect(() => parseProducts({ items: [] })).toThrow('Invalid API response')
  })

  it('rejects invalid cart quantities and missing ownership', () => {
    expect(() =>
      parseCart([{ id: 'cart-1', productId: 'product-1', quantity: 0 }])
    ).toThrow('Invalid API response')
  })

  it('normalizes numeric cart ids from the local database', () => {
    expect(
      parseCart([
        {
          id: 1,
          userId: 'user-1',
          productId: 'product-1',
          quantity: 1,
        },
      ])
    ).toEqual([
      {
        id: '1',
        userId: 'user-1',
        productId: 'product-1',
        quantity: 1,
      },
    ])
  })
})
