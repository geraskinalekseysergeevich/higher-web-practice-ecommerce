import type { Order } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  CreateOrderBody,
  OrdersQueryArgs,
} from './common/types'
import { parseOrderResponse, parseOrders } from './common/validation'

const ORDERS_URL = apiResources.orders

const getOrderTags = (orders?: Order[]): ApiTag[] => {
  if (!orders) {
    return [createListTag(apiResources.orders)]
  }

  return [
    ...orders.map((order) => createItemTag(apiResources.order, order.id)),
    createListTag(apiResources.orders),
  ]
}

const getOrdersEndpoint = (builder: ApiBuilder) =>
  builder.query<Order[], void>({
    query: () => ORDERS_URL,
    transformResponse: parseOrders,
    providesTags: (result) => getOrderTags(result),
  })

const getOrderByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<Order, string>({
    query: (orderId) => `${ORDERS_URL}/${orderId}`,
    transformResponse: parseOrderResponse,
    providesTags: (_result, _error, orderId) => [
      createItemTag(apiResources.order, orderId),
    ],
  })

const getOrdersByUserIdEndpoint = (builder: ApiBuilder) =>
  builder.query<Order[], OrdersQueryArgs['userId']>({
    query: (userId) => ({
      url: ORDERS_URL,
      params: { userId },
    }),
    transformResponse: parseOrders,
    providesTags: (result, _error, userId) => {
      if (!userId) {
        return [createListTag(apiResources.orders)]
      }

      if (!result) {
        return [createItemTag(apiResources.orders, userId)]
      }

      return [
        ...result.map((order) => createItemTag(apiResources.order, order.id)),
        createItemTag(apiResources.orders, userId),
      ]
    },
  })

const createOrderEndpoint = (builder: ApiBuilder) =>
  builder.mutation<Order, CreateOrderBody>({
    query: (payload) => ({
      url: ORDERS_URL,
      method: 'POST',
      body: payload,
    }),
    transformResponse: parseOrderResponse,
    invalidatesTags: (_result, _error, payload) => [
      createListTag(apiResources.orders),
      createItemTag(apiResources.orders, payload.userId),
    ],
  })

const ordersApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: getOrdersEndpoint(builder),
    getOrderById: getOrderByIdEndpoint(builder),
    getOrdersByUserId: getOrdersByUserIdEndpoint(builder),
    createOrder: createOrderEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersByUserIdQuery,
  useCreateOrderMutation,
} = ordersApi
