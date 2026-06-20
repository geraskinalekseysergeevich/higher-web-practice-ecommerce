import type { CartItem } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createListTag } from './common/tags'
import type { ApiBuilder, CartBody, CartItemBody } from './common/types'

const CART_URL = apiResources.cart

const getCartEndpoint = (builder: ApiBuilder) =>
  builder.query<CartItem[], void>({
    query: () => CART_URL,
    providesTags: [createListTag(apiResources.cart)],
  })

const addToCartEndpoint = (builder: ApiBuilder) =>
  builder.mutation<CartItem, CartBody>({
    query: ({ productId, quantity = 1 }) => ({
      url: CART_URL,
      method: 'POST',
      body: { productId, quantity },
    }),
    invalidatesTags: [createListTag(apiResources.cart)],
  })

const updateCartItemEndpoint = (builder: ApiBuilder) =>
  builder.mutation<CartItem, CartItemBody>({
    query: ({ id, quantity }) => ({
      url: `${CART_URL}/${id}`,
      method: 'PATCH',
      body: { quantity },
    }),
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
