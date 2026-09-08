import type { CartItem, Product } from '../../../types'
import { getCartLineItems } from './getCartLineItems'

describe('getCartLineItems', () => {
  it('maps an available product to a cart line item', () => {
    const cartItems: CartItem[] = [
      { id: 'cart-1', userId: 'user-1', productId: 'product-1', quantity: 2 },
    ]
    const products: Product[] = [
      {
        id: 'product-1',
        name: 'Председатель',
        description: 'First',
        price: 5590,
        images: ['/mustaches/chairman/0.png'],
        characteristics: {},
        inStock: true,
        rating: 4,
        ratingCount: 1,
        createdAt: '2026-03-01T10:00:00Z',
      },
    ]

    expect(getCartLineItems(cartItems, products)).toEqual([
      expect.objectContaining({
        id: 'cart-1',
        name: 'Председатель',
        unitPrice: 5590,
        quantity: 2,
        totalPrice: 11180,
        inStock: true,
      }),
    ])
  })

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
