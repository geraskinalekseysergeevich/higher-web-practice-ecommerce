import type { CartItem, Product } from '../../../types'

export type CartLineItem = {
  id: string
  productId: string
  name: string
  image: string
  inStock: boolean
  unitPrice: number
  quantity: number
  totalPrice: number
  isMissing?: boolean
}

export const getCartLineItems = (
  cartItems: CartItem[],
  products: Product[]
): CartLineItem[] =>
  cartItems.flatMap((item) => {
    const product = products.find(({ id }) => id === item.productId)

    if (!product) {
      return [
        {
          id: item.id,
          productId: item.productId,
          name: 'Товар недоступен',
          image: '/product-placeholder.svg',
          inStock: false,
          unitPrice: 0,
          quantity: item.quantity,
          totalPrice: 0,
          isMissing: true,
        },
      ]
    }

    const unitPrice = product.price

    return [
      {
        id: item.id,
        productId: item.productId,
        name: product.name,
        image: product.images[0] ?? '/favicon.svg',
        inStock: product.inStock,
        unitPrice,
        quantity: item.quantity,
        totalPrice: unitPrice * item.quantity,
      },
    ]
  })
