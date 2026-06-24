import type { ProductRating } from '../../../types'

const reviewDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const sortByCreatedAtDesc = (left: ProductRating, right: ProductRating) =>
  Date.parse(right.createdAt) - Date.parse(left.createdAt)

const getRatingStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => index < rating)

export type ProductReviewItem = {
  id: string
  ratingLabel: string
  rating: number
  userName: string
  dateLabel: string
  stars: boolean[]
}

export const getProductReviewItems = (
  ratings: ProductRating[]
): ProductReviewItem[] =>
  ratings
    .slice()
    .sort(sortByCreatedAtDesc)
    .map((rating) => ({
      id: `${rating.productId}-${rating.userId}-${rating.createdAt}`,
      ratingLabel: rating.rating.toFixed(1),
      rating: rating.rating,
      userName: rating.userName,
      dateLabel: reviewDateFormatter.format(new Date(rating.createdAt)),
      stars: getRatingStars(rating.rating),
    }))
