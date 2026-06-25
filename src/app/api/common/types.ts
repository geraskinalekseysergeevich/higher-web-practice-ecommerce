import type {
  AddToCartPayload,
  LoginPayload,
  Order,
  ProductRating,
  ProductSort,
  RegisterPayload,
  UpdateProfilePayload,
} from '../../../types'
import { emptySplitApi } from '../baseApi'
import { apiTagTypes } from './tags'

export type ApiTagType = (typeof apiTagTypes)[number]

export type ApiTag = {
  type: ApiTagType
  id: string
}

export type ApiBuilder = Parameters<
  typeof emptySplitApi.injectEndpoints
>[0]['endpoints'] extends (builder: infer Builder) => unknown
  ? Builder
  : never

export type ProductsQueryArgs = {
  page?: number
  pageSize?: number
  sort?: ProductSort
}

export type OrdersQueryArgs = {
  userId?: string
}

export type CreateUserBody = RegisterPayload

export type UsersCredentials = LoginPayload

export type UpdateUserBody = {
  userId: string
  payload: UpdateProfilePayload
}

export type CreateOrderBody = Order

export type RatingBody = Omit<ProductRating, 'createdAt'> & {
  createdAt?: string
}

export type CartBody = AddToCartPayload

export type CartItemBody = {
  id: string
  quantity: number
}
