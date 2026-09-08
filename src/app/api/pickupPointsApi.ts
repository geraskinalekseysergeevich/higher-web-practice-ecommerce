import type { PickupPoint } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type { ApiBuilder, ApiTag } from './common/types'
import {
  parsePickupPointResponse,
  parsePickupPoints,
} from './common/validation'

const PICKUP_POINTS_URL = apiResources.pickupPoints

const getPickupPointTags = (pickupPoints?: PickupPoint[]): ApiTag[] => {
  if (!pickupPoints) {
    return [createListTag(apiResources.pickupPoints)]
  }

  return [
    ...pickupPoints.map((pickupPoint) =>
      createItemTag(apiResources.pickupPoints, pickupPoint.id)
    ),
    createListTag(apiResources.pickupPoints),
  ]
}

const getPickupPointsEndpoint = (builder: ApiBuilder) =>
  builder.query<PickupPoint[], void>({
    query: () => PICKUP_POINTS_URL,
    transformResponse: parsePickupPoints,
    providesTags: (result) => getPickupPointTags(result),
  })

const getPickupPointByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<PickupPoint, string>({
    query: (pickupPointId) => `${PICKUP_POINTS_URL}/${pickupPointId}`,
    transformResponse: parsePickupPointResponse,
    providesTags: (_result, _error, pickupPointId) => [
      createItemTag(apiResources.pickupPoints, pickupPointId),
    ],
  })

const pickupPointsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getPickupPoints: getPickupPointsEndpoint(builder),
    getPickupPointById: getPickupPointByIdEndpoint(builder),
  }),
  overrideExisting: false,
})

export const { useGetPickupPointsQuery, useGetPickupPointByIdQuery } =
  pickupPointsApi
