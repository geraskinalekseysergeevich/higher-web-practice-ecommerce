import type { CartLineItem } from './getCartLineItems'

export type CartSummary = {
  totalItems: number
  totalPrice: number
}

export const getCartSummary = (items: CartLineItem[]): CartSummary =>
  items.reduce(
    (summary, item) => ({
      totalItems: summary.totalItems + item.quantity,
      totalPrice: summary.totalPrice + item.totalPrice,
    }),
    {
      totalItems: 0,
      totalPrice: 0,
    }
  )
