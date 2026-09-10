import type { Product } from '../../types'
import { emptySplitApi } from './baseApi'
import { apiResources, createItemTag, createListTag } from './common/tags'
import type {
  ApiBuilder,
  ApiTag,
  UpdateProductRatingSummaryBody,
} from './common/types'
import { parseProductResponse, parseProducts } from './common/validation'

const PRODUCTS_URL = apiResources.products

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

const updateProductRatingSummaryEndpoint = (builder: ApiBuilder) =>
  builder.mutation<Product, UpdateProductRatingSummaryBody>({
    query: ({ productId, rating, ratingCount }) => ({
      url: `${PRODUCTS_URL}/${productId}`,
      method: 'PATCH',
      body: { rating, ratingCount },
    }),
    transformResponse: parseProductResponse,
    invalidatesTags: (_result, _error, { productId }) => [
      createItemTag(apiResources.product, productId),
      createListTag(apiResources.products),
    ],
  })

export const productsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: getAllProductsEndpoint(builder),
    getProductById: getProductByIdEndpoint(builder),
    updateProductRatingSummary: updateProductRatingSummaryEndpoint(builder),
  }),
  overrideExisting: false,
})

export const { useGetAllProductsQuery, useGetProductByIdQuery } = productsApi
