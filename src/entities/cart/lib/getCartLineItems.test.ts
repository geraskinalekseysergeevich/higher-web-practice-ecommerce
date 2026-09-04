import type { CartItem, Product } from '../../../types'
import { getCartLineItems } from './getCartLineItems'

describe('getCartLineItems', () => {
  it('keeps a missing product visible as an unavailable cart item', () => {
    const cartItems: CartItem[] = [
      { id: 'cart-1', userId: 'user-1', productId: 'missing', quantity: 2 },
    ]

    expect(getCartLineItems(cartItems, [] as Product[])).toEqual([
      expect.objectContaining({
        isMissing: true,
        inStock: false,
        name: 'Товар недоступен',
        quantity: 2,
      }),
    ])
  })
})
