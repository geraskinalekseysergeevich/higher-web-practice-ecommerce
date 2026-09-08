export const apiResources = {
  products: 'products',
  product: 'product',
  users: 'users',
  user: 'user',
  orders: 'orders',
  order: 'order',
  cart: 'cart',
  ratings: 'ratings',
  pickupPoints: 'pickupPoints',
} as const

export const apiTagTypes = [
  apiResources.products,
  apiResources.product,
  apiResources.users,
  apiResources.user,
  apiResources.orders,
  apiResources.order,
  apiResources.cart,
  apiResources.ratings,
  apiResources.pickupPoints,
] as const

export type ApiTagType = (typeof apiTagTypes)[number]

export const LIST_ID = 'LIST' as const

export const createListTag = (type: ApiTagType) => ({
  type,
  id: LIST_ID,
})

export const createItemTag = (type: ApiTagType, id: string) => ({
  type,
  id,
})
