import type { Product, ProductSort } from '../../../types'

export type HomeProductsFilters = {
  category?: string
  subcategory?: string
  styles?: string[]
  density?: string
  inStockOnly?: boolean
  ratedOnly?: boolean
  minPrice?: number
  maxPrice?: number
  sort?: ProductSort
  page?: number
  pageSize?: number
}

type HomeProductsResult = {
  items: Product[]
  total: number
  totalPages: number
}

const sortProducts = (products: Product[], sort?: ProductSort) => {
  const items = [...products]

  switch (sort) {
    case 'price_asc':
      return items.sort((left, right) => left.price - right.price)
    case 'price_desc':
      return items.sort((left, right) => right.price - left.price)
    case 'rating':
      return items.sort((left, right) => {
        if (right.rating !== left.rating) {
          return right.rating - left.rating
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      })
    case 'newest':
    default:
      return items.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      )
  }
}

const hasCharacteristicValue = (
  product: Product,
  key: keyof Product['characteristics'],
  expected?: string
) => {
  if (!expected) {
    return true
  }

  return product.characteristics[key] === expected
}

export const getVisibleHomeProducts = (
  products: Product[],
  filters: HomeProductsFilters = {}
): HomeProductsResult => {
  const {
    category,
    subcategory,
    styles = [],
    density,
    inStockOnly = false,
    ratedOnly = false,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    pageSize = 12,
  } = filters

  const filteredProducts = products.filter((product) => {
    const matchesCategory = hasCharacteristicValue(
      product,
      'категория',
      category
    )
    const matchesSubcategory = hasCharacteristicValue(
      product,
      'подкатегория',
      subcategory
    )
    const matchesStyle =
      styles.length === 0 || styles.includes(product.characteristics['стиль'])
    const matchesDensity = hasCharacteristicValue(
      product,
      'густота',
      density
    )
    const matchesInStock = !inStockOnly || product.inStock
    const matchesRating = !ratedOnly || product.rating > 0
    const matchesMinPrice = minPrice === undefined || product.price >= minPrice
    const matchesMaxPrice = maxPrice === undefined || product.price <= maxPrice

    return (
      matchesCategory &&
      matchesSubcategory &&
      matchesStyle &&
      matchesDensity &&
      matchesInStock &&
      matchesRating &&
      matchesMinPrice &&
      matchesMaxPrice
    )
  })

  const sortedProducts = sortProducts(filteredProducts, sort)
  const total = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const startIndex = (safePage - 1) * pageSize

  return {
    items: sortedProducts.slice(startIndex, startIndex + pageSize),
    total,
    totalPages,
  }
}
