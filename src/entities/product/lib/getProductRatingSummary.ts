import type { Order, ProductRating } from '../../../types'

export type ProductRatingSummary = {
  rating: number
  ratingCount: number
}

export const getProductRatingSummary = (
  ratings: ProductRating[]
): ProductRatingSummary => {
  if (ratings.length === 0) {
    return { rating: 0, ratingCount: 0 }
  }

  const total = ratings.reduce((sum, item) => sum + item.rating, 0)

  return {
    rating: Number((total / ratings.length).toFixed(1)),
    ratingCount: ratings.length,
  }
}

export const canUserRateProduct = (
  orders: Pick<Order, 'userId' | 'status' | 'items'>[],
  userId: string,
  productId: string
) => {
  return orders.some(
    (order) =>
      order.userId === userId &&
      order.status === 'delivered' &&
      order.items.some((item) => item.productId === productId)
  )
}

export const getUserProductRating = (
  ratings: ProductRating[],
  userId: string,
  productId: string
) =>
  ratings.find(
    (rating) => rating.userId === userId && rating.productId === productId
  )
