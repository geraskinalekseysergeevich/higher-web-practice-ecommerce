import type { ProductRating } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  RatingBody,
  UpdateRatingBody,
} from './common/types'
import { parseRatingResponse, parseRatings } from './common/validation'

const RATINGS_URL = apiResources.ratings

const getRatingTags = (ratings?: ProductRating[]): ApiTag[] => {
  if (!ratings) {
    return [createListTag(apiResources.ratings)]
  }

  return [
    ...ratings.map((rating) =>
      createItemTag(apiResources.ratings, rating.productId)
    ),
    createListTag(apiResources.ratings),
  ]
}

const getRatingsEndpoint = (builder: ApiBuilder) =>
  builder.query<ProductRating[], void>({
    query: () => RATINGS_URL,
    transformResponse: parseRatings,
    providesTags: (result) => getRatingTags(result),
  })

const getRatingsByProductIdEndpoint = (builder: ApiBuilder) =>
  builder.query<ProductRating[], string>({
    query: (productId) => ({
      url: RATINGS_URL,
      params: { productId },
    }),
    transformResponse: parseRatings,
    providesTags: (_result, _error, productId) => [
      createItemTag(apiResources.ratings, productId),
    ],
  })

const createRatingEndpoint = (builder: ApiBuilder) =>
  builder.mutation<ProductRating, RatingBody>({
    query: ({ createdAt, ...body }) => ({
      url: RATINGS_URL,
      method: 'POST',
      body: {
        ...body,
        createdAt: createdAt ?? new Date().toISOString(),
      },
    }),
    transformResponse: parseRatingResponse,
    invalidatesTags: (_result, _error, body) => [
      createItemTag(apiResources.ratings, body.productId),
      createListTag(apiResources.ratings),
    ],
  })

const updateRatingEndpoint = (builder: ApiBuilder) =>
  builder.mutation<ProductRating, UpdateRatingBody>({
    query: ({ id, rating }) => ({
      url: `${RATINGS_URL}/${id}`,
      method: 'PATCH',
      body: { rating },
    }),
    transformResponse: parseRatingResponse,
    invalidatesTags: [createListTag(apiResources.ratings)],
  })

const ratingsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: getRatingsEndpoint(builder),
    getRatingsByProductId: getRatingsByProductIdEndpoint(builder),
    createRating: createRatingEndpoint(builder),
    updateRating: updateRatingEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetRatingsQuery,
  useGetRatingsByProductIdQuery,
  useCreateRatingMutation,
  useUpdateRatingMutation,
} = ratingsApi
