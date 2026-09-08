export type CartItem = {
  id: string
  userId: string
  productId: string
  quantity: number
}

export type Cart = {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export type AddToCartPayload = {
  userId: string
  productId: string
  quantity?: number
}
