import type { StoredUser } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  CreateUserBody,
  UpdateUserBody,
  UsersCredentials,
} from './common/types'

const USERS_URL = apiResources.users

const getUserTags = (users?: StoredUser[]): ApiTag[] => {
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
    id: crypto.randomUUID(),
    notifyByEmail: false,
    language: 'ru' as const,
    createdAt: new Date().toISOString(),
  }
}

const getUsersEndpoint = (builder: ApiBuilder) =>
  builder.query<StoredUser[], void>({
    query: () => USERS_URL,
    providesTags: (result) => getUserTags(result),
  })

const getUserByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<StoredUser, string>({
    query: (userId) => `${USERS_URL}/${userId}`,
    providesTags: (_result, _error, userId) => [
      createItemTag(apiResources.user, userId),
    ],
  })

const createUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<StoredUser, CreateUserBody>({
    query: (payload) => ({
      url: USERS_URL,
      method: 'POST',
      body: createUserBody(payload),
    }),
    invalidatesTags: [createListTag(apiResources.users)],
  })

const findUsersByCredentialsEndpoint = (builder: ApiBuilder) =>
  builder.query<StoredUser[], UsersCredentials>({
    query: (credentials) => ({
      url: USERS_URL,
      params: credentials,
    }),
    providesTags: [createListTag(apiResources.users)],
  })

const updateUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<StoredUser, UpdateUserBody>({
    query: ({ userId, payload }) => ({
      url: `${USERS_URL}/${userId}`,
      method: 'PATCH',
      body: payload,
    }),
    invalidatesTags: (_result, _error, { userId }) => [
      createItemTag(apiResources.user, userId),
    ],
  })

const usersApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: getUsersEndpoint(builder),
    getUserById: getUserByIdEndpoint(builder),
    createUser: createUserEndpoint(builder),
    findUsersByCredentials: findUsersByCredentialsEndpoint(builder),
    updateUser: updateUserEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useFindUsersByCredentialsQuery,
  useLazyFindUsersByCredentialsQuery,
} = usersApi
