import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { apiTagTypes } from './common/tags'

export const emptySplitApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: [...apiTagTypes],
  endpoints: () => ({}),
})

export const baseApi = emptySplitApi
