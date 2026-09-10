import type { BaseQueryApi } from '@reduxjs/toolkit/query'

import { getProductRatingSummary } from '../../entities/product/lib/getProductRatingSummary'
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
import { productsApi } from './productsApi'

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

const synchronizeProductRatingSummary = async (
  productId: string,
  dispatch: BaseQueryApi['dispatch']
) => {
  const ratings = await dispatch(
    ratingsApi.endpoints.getRatingsByProductId.initiate(productId, {
      forceRefetch: true,
      subscribe: false,
    })
  ).unwrap()

  await dispatch(
    productsApi.endpoints.updateProductRatingSummary.initiate({
      productId,
      ...getProductRatingSummary(ratings),
    })
  ).unwrap()
}

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
    onQueryStarted: async ({ productId }, { dispatch, queryFulfilled }) => {
      try {
        await queryFulfilled
        await synchronizeProductRatingSummary(productId, dispatch)
      } catch {
        return
      }
    },
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
    onQueryStarted: async (_body, { dispatch, queryFulfilled }) => {
      try {
        const { data: rating } = await queryFulfilled
        await synchronizeProductRatingSummary(rating.productId, dispatch)
      } catch {
        return
      }
    },
    invalidatesTags: (result) => [
      createListTag(apiResources.ratings),
      ...(result
        ? [createItemTag(apiResources.ratings, result.productId)]
        : []),
    ],
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
