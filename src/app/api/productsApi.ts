import type { Product } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type { ApiBuilder, ApiTag, ProductsQueryArgs } from './common/types'
import { parseProductResponse, parseProducts } from './common/validation'

const PRODUCTS_URL = apiResources.products

const getProductsOrder = (sort?: ProductsQueryArgs['sort']) => {
  switch (sort) {
    case 'price_asc':
      return { _sort: 'price', _order: 'asc' as const }
    case 'price_desc':
      return { _sort: 'price', _order: 'desc' as const }
    case 'newest':
      return { _sort: 'createdAt', _order: 'desc' as const }
    case 'rating':
      return { _sort: 'rating', _order: 'desc' as const }
    default:
      return {}
  }
}

const getProductTags = (products?: Product[]): ApiTag[] => {
  if (!products) {
    return [createListTag(apiResources.products)]
  }

  return [
    ...products.map((product) =>
      createItemTag(apiResources.product, product.id)
    ),
    createListTag(apiResources.products),
  ]
}

const getProductsEndpoint = (builder: ApiBuilder) =>
  builder.query<Product[], ProductsQueryArgs | void>({
    query: (params) => ({
      url: PRODUCTS_URL,
      params: {
        _page: params?.page ?? 1,
        _limit: params?.pageSize ?? 12,
        ...getProductsOrder(params?.sort),
      },
    }),
    transformResponse: parseProducts,
    providesTags: (result) => getProductTags(result),
  })

const getAllProductsEndpoint = (builder: ApiBuilder) =>
  builder.query<Product[], void>({
    query: () => PRODUCTS_URL,
    transformResponse: parseProducts,
    providesTags: (result) => getProductTags(result),
  })

const getProductByIdEndpoint = (builder: ApiBuilder) =>
  builder.query<Product, string>({
    query: (productId) => `${PRODUCTS_URL}/${productId}`,
    transformResponse: parseProductResponse,
    providesTags: (_result, _error, productId) => [
      createItemTag(apiResources.product, productId),
    ],
  })

const productsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: getProductsEndpoint(builder),
    getAllProducts: getAllProductsEndpoint(builder),
    getProductById: getProductByIdEndpoint(builder),
  }),
  overrideExisting: false,
})

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
} = productsApi
