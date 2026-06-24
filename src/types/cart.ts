export type CartItem = {
  id: string
  productId: string
  quantity: number
}

export type Cart = {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export type AddToCartPayload = {
  productId: string
  quantity?: number
}
