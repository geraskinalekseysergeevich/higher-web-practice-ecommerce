import type { CartItem, Product } from '../../../types'

export type CartLineItem = {
  id: string
  productId: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

export const getCartLineItems = (
  cartItems: CartItem[],
  products: Product[]
): CartLineItem[] =>
  cartItems.flatMap((item) => {
    const product = products.find(({ id }) => id === item.productId)

    if (!product) {
      return []
    }

    const unitPrice = product.price

    return [
      {
        id: item.id,
        productId: item.productId,
        name: product.name,
        image: product.images[0] ?? '/favicon.svg',
        unitPrice,
        quantity: item.quantity,
        totalPrice: unitPrice * item.quantity,
      },
    ]
  })
