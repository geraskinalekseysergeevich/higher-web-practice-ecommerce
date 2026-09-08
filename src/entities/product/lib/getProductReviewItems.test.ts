import type { ProductRating } from '../../../types'
import { getProductReviewItems } from './getProductReviewItems'

const ratings: ProductRating[] = [
  {
    id: 'rating-old',
    productId: 'product-1',
    userId: 'user-1',
    userName: 'Иван',
    rating: 5,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'rating-new',
    productId: 'product-1',
    userId: 'user-2',
    userName: 'Анна',
    rating: 4,
    createdAt: '2026-03-02T10:00:00Z',
  },
]

describe('getProductReviewItems', () => {
  it('sorts reviews by date and prepares their display data', () => {
    const reviews = getProductReviewItems(ratings)

    expect(reviews.map((review) => review.id)).toEqual([
      'rating-new',
      'rating-old',
    ])
    expect(reviews[0]).toEqual(
      expect.objectContaining({
        ratingLabel: '4.0',
        rating: 4,
        userName: 'Анна',
        stars: [true, true, true, true, false],
      })
    )
    expect(reviews[0].dateLabel).toContain('2026')
  })
})
