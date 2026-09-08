import type { CartItem } from '../../../types'

export const getCartItemCount = (items: Pick<CartItem, 'quantity'>[]) =>
  items.reduce(
    (total, item) =>
      Number.isInteger(item.quantity) && item.quantity > 0
        ? total + item.quantity
        : total,
    0
  )
