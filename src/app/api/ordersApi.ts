import type { Order } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  CreateOrderBody,
  OrdersQueryArgs,
} from './common/types'

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
    providesTags: (result) => getOrderTags(result),
  })

const getOrderByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<Order, string>({
    query: (orderId) => `${ORDERS_URL}/${orderId}`,
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
    invalidatesTags: [createListTag(apiResources.orders)],
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
