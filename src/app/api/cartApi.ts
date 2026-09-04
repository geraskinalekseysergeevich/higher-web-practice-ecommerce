import type { CartItem } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createListTag } from './common/tags'
import type { ApiBuilder, CartBody, CartItemBody } from './common/types'
import { parseCart, parseCartResponse } from './common/validation'

const CART_URL = apiResources.cart

const getCartEndpoint = (builder: ApiBuilder) =>
  builder.query<CartItem[], string>({
    query: (userId) => ({
      url: CART_URL,
      params: { userId },
    }),
    transformResponse: parseCart,
    providesTags: [createListTag(apiResources.cart)],
  })

const addToCartEndpoint = (builder: ApiBuilder) =>
  builder.mutation<CartItem, CartBody>({
    query: ({ userId, productId, quantity = 1 }) => ({
      url: CART_URL,
      method: 'POST',
      body: { userId, productId, quantity },
    }),
    transformResponse: parseCartResponse,
    invalidatesTags: [createListTag(apiResources.cart)],
  })

const updateCartItemEndpoint = (builder: ApiBuilder) =>
  builder.mutation<CartItem, CartItemBody>({
    query: ({ id, quantity }) => ({
      url: `${CART_URL}/${id}`,
      method: 'PATCH',
      body: { quantity },
    }),
    transformResponse: parseCartResponse,
    invalidatesTags: [createListTag(apiResources.cart)],
  })

const removeFromCartEndpoint = (builder: ApiBuilder) =>
  builder.mutation<void, string>({
    query: (id) => ({
      url: `${CART_URL}/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: [createListTag(apiResources.cart)],
  })

const cartApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: getCartEndpoint(builder),
    addToCart: addToCartEndpoint(builder),
    updateCartItem: updateCartItemEndpoint(builder),
    removeFromCart: removeFromCartEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi
