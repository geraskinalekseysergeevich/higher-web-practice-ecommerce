import type { StoredUser, User } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  CreateUserBody,
  UpdateUserBody,
  UserEmailQuery,
} from './common/types'
import {
  parseUserEmails,
  parseUserResponse,
  parseUsers,
} from './common/validation'

const USERS_URL = apiResources.users

const getUserTags = (users?: Array<Pick<User, 'id'>>): ApiTag[] => {
  if (!users) {
    return [createListTag(apiResources.users)]
  }

  return [
    ...users.map((user) => createItemTag(apiResources.user, user.id)),
    createListTag(apiResources.users),
  ]
}

const createUserBody = (payload: CreateUserBody) => {
  const { confirmPassword, ...body } = payload
  void confirmPassword

  return {
    ...body,
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email: body.email.trim().toLowerCase(),
    id: crypto.randomUUID(),
    notifyByEmail: false,
    language: 'ru' as const,
    createdAt: new Date().toISOString(),
  }
}

const getUsersEndpoint = (builder: ApiBuilder) =>
  builder.query<Array<Pick<User, 'id' | 'email'>>, void>({
    query: () => ({
      url: USERS_URL,
      params: { _select: 'id,email' },
    }),
    transformResponse: parseUserEmails,
    providesTags: (result) => getUserTags(result),
  })

const getUserByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<StoredUser, string>({
    query: (userId) => `${USERS_URL}/${userId}`,
    transformResponse: parseUserResponse,
    providesTags: (_result, _error, userId) => [
      createItemTag(apiResources.user, userId),
    ],
  })

const findUserByEmailEndpoint = (builder: ApiBuilder) =>
  builder.query<StoredUser[], UserEmailQuery>({
    query: ({ email }) => ({
      url: USERS_URL,
      params: { email },
    }),
    transformResponse: parseUsers,
    providesTags: [createListTag(apiResources.users)],
  })

const createUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<StoredUser, CreateUserBody>({
    query: (payload) => ({
      url: USERS_URL,
      method: 'POST',
      body: createUserBody(payload),
    }),
    transformResponse: parseUserResponse,
    invalidatesTags: [createListTag(apiResources.users)],
  })

const updateUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<StoredUser, UpdateUserBody>({
    query: ({ userId, payload }) => ({
      url: `${USERS_URL}/${userId}`,
      method: 'PATCH',
      body: payload,
    }),
    transformResponse: parseUserResponse,
    invalidatesTags: (_result, _error, { userId }) => [
      createItemTag(apiResources.user, userId),
    ],
  })

const usersApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: getUsersEndpoint(builder),
    getUserById: getUserByIdEndpoint(builder),
    findUserByEmail: findUserByEmailEndpoint(builder),
    createUser: createUserEndpoint(builder),
    updateUser: updateUserEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLazyFindUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi
