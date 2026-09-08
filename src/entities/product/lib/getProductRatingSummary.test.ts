import type { Order, ProductRating } from '../../../types'
import {
  canUserRateProduct,
  getProductRatingSummary,
  getUserProductRating,
} from './getProductRatingSummary'

const productId = 'product-1'
const userId = 'user-1'

const ratings: ProductRating[] = [
  {
    productId,
    userId: 'user-2',
    userName: 'Анна',
    rating: 5,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    productId,
    userId: 'user-3',
    userName: 'Иван',
    rating: 4,
    createdAt: '2026-03-02T10:00:00Z',
  },
]

describe('getProductRatingSummary', () => {
  it('calculates the average and count from product ratings', () => {
    expect(getProductRatingSummary(ratings)).toEqual({
      rating: 4.5,
      ratingCount: 2,
    })
  })

  it('returns an empty summary when there are no ratings', () => {
    expect(getProductRatingSummary([])).toEqual({
      rating: 0,
      ratingCount: 0,
    })
  })
})

describe('canUserRateProduct', () => {
  it('allows a user who received an order containing the product', () => {
    const orders = [
      {
        userId,
        status: 'delivered',
        items: [{ productId, quantity: 1 }],
      },
    ] as Order[]

    expect(canUserRateProduct(orders, userId, productId)).toBe(true)
  })

  it('does not allow a user before delivery or after an existing rating', () => {
    const orders = [
      {
        userId,
        status: 'processing',
        items: [{ productId, quantity: 1 }],
      },
    ] as Order[]

    expect(canUserRateProduct(orders, userId, productId)).toBe(false)
  })
})

it('finds the existing rating to update instead of creating a duplicate', () => {
  expect(getUserProductRating(ratings, 'user-2', productId)).toEqual(ratings[0])
})
