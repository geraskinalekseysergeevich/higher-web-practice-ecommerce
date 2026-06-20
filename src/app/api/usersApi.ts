import type { User } from '../../types'
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

const getUserTags = (users?: User[]): ApiTag[] => {
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
    notifyByEmail: false,
    language: 'ru' as const,
    createdAt: new Date().toISOString(),
  }
}

const getUsersEndpoint = (builder: ApiBuilder) =>
  builder.query<User[], void>({
    query: () => USERS_URL,
    providesTags: (result) => getUserTags(result),
  })

const getUserByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<User, string>({
    query: (userId) => `${USERS_URL}/${userId}`,
    providesTags: (_result, _error, userId) => [
      createItemTag(apiResources.user, userId),
    ],
  })

const createUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<User, CreateUserBody>({
    query: (payload) => ({
      url: USERS_URL,
      method: 'POST',
      body: createUserBody(payload),
    }),
    invalidatesTags: [createListTag(apiResources.users)],
  })

const findUsersByCredentialsEndpoint = (builder: ApiBuilder) =>
  builder.query<User[], UsersCredentials>({
    query: (credentials) => ({
      url: USERS_URL,
      params: credentials,
    }),
    providesTags: [createListTag(apiResources.users)],
  })

const updateUserEndpoint = (builder: ApiBuilder) =>
  builder.mutation<User, UpdateUserBody>({
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
