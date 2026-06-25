import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { getProductFacetOptions } from '../../entities/product/lib/getProductFacetOptions'
import type { ProductSort } from '../../types'
import { HomeCatalog } from './components/HomeCatalog/HomeCatalog'
import { HomeSidebar } from './components/HomeSidebar/HomeSidebar'
import { HomeTopBar } from './components/HomeTopBar/HomeTopBar'
import styles from './HomePage.module.css'
import { getVisibleHomeProducts } from './lib/homeProducts'

export const HomePage = () => {
  const { data: allProducts = [], isLoading: isAllProductsLoading } =
    useGetAllProductsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, styleOptions, densityOptions, subcategoriesByCategory } =
    getProductFacetOptions(allProducts)

  const selectedCategory = searchParams.get('category') ?? undefined
  const selectedSubcategory = searchParams.get('subcategory') ?? undefined
  const selectedStyles = searchParams.getAll('style')
  const selectedDensity = searchParams.get('density') ?? undefined
  const inStockOnly = searchParams.get('inStock') === '1'
  const ratedOnly = searchParams.get('rated') === '1'
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const currentPage = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1
  const sortParam = searchParams.get('sort')
  const viewParam = searchParams.get('view')
  const sort: ProductSort =
    sortParam === 'price_asc' ||
    sortParam === 'price_desc' ||
    sortParam === 'newest' ||
    sortParam === 'rating'
      ? sortParam
      : 'newest'
  const view = viewParam === 'table' ? 'table' : 'list'

  const visibleProducts = useMemo(
    () =>
      getVisibleHomeProducts(allProducts, {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        styles: selectedStyles,
        density: selectedDensity,
        inStockOnly,
        ratedOnly,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        page: currentPage,
        pageSize: 12,
      }),
    [
      allProducts,
      currentPage,
      inStockOnly,
      maxPrice,
      minPrice,
      ratedOnly,
      sort,
      selectedCategory,
      selectedDensity,
      selectedStyles,
      selectedSubcategory,
    ]
  )

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    selectedStyles.length > 0 ||
    Boolean(selectedDensity) ||
    inStockOnly ||
    ratedOnly ||
    Boolean(minPrice) ||
    Boolean(maxPrice)

  const updateSearchParams = (
    updater: (params: URLSearchParams) => URLSearchParams
  ) => {
    setSearchParams(updater(new URLSearchParams(searchParams)))
  }

  const setSingleParam = (key: string, value?: string) => {
    updateSearchParams((params) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      params.set('page', '1')

      return params
    })
  }

  const setBooleanParam = (key: string, value: boolean) => {
    setSingleParam(key, value ? '1' : undefined)
  }

  const toggleStyle = (style: string) => {
    updateSearchParams((params) => {
      const nextStyles = params
        .getAll('style')
        .filter((currentStyle) => currentStyle !== style)

      if (!selectedStyles.includes(style)) {
        nextStyles.push(style)
      }

      params.delete('style')
      nextStyles.forEach((value) => params.append('style', value))
      params.set('page', '1')

      return params
    })
  }

  const clearFilters = () => {
    updateSearchParams((params) => {
      params.delete('category')
      params.delete('subcategory')
      params.delete('style')
      params.delete('density')
      params.delete('inStock')
      params.delete('rated')
      params.delete('minPrice')
      params.delete('maxPrice')
      params.set('page', '1')

      return params
    })
  }

  return (
    <section className={styles.page} aria-labelledby="home-title">
      <div className={styles.layout}>
        <HomeSidebar
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          inStockOnly={inStockOnly}
          maxPrice={maxPrice}
          minPrice={minPrice}
          onCategoryChange={(category) =>
            updateSearchParams((params) => {
              if (category) {
                params.set('category', category)
              } else {
                params.delete('category')
              }
              params.delete('subcategory')
              params.set('page', '1')
              return params
            })
          }
          onClearFilters={clearFilters}
          onDensityChange={(density) => setSingleParam('density', density)}
          onInStockChange={(value) => setBooleanParam('inStock', value)}
          onMaxPriceChange={(value) => setSingleParam('maxPrice', value)}
          onMinPriceChange={(value) => setSingleParam('minPrice', value)}
          onRatedChange={(value) => setBooleanParam('rated', value)}
          onStyleToggle={toggleStyle}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedDensity={selectedDensity}
          selectedStyles={selectedStyles}
          styleOptions={styleOptions}
          densityOptions={densityOptions}
          subcategoriesByCategory={subcategoriesByCategory}
          ratedOnly={ratedOnly}
          onSubcategoryChange={(subcategory) =>
            setSingleParam('subcategory', subcategory)
          }
        />

        <div className={styles.content}>
          <HomeTopBar
            onSortChange={(nextSort) =>
              updateSearchParams((params) => {
                params.set('sort', nextSort)
                params.set('page', '1')
                return params
              })
            }
            onViewChange={(nextView) =>
              updateSearchParams((params) => {
                params.set('view', nextView)
                params.set('page', '1')
                return params
              })
            }
            sort={sort}
            view={view}
          />
          <HomeCatalog
            currentPage={visibleProducts.totalPages < currentPage ? visibleProducts.totalPages : currentPage}
            isLoading={isAllProductsLoading}
            onClearFilters={clearFilters}
            onPageChange={(page) =>
              updateSearchParams((params) => {
                params.set('page', String(page))
                return params
              })
            }
            products={visibleProducts.items}
            view={view}
            totalPages={visibleProducts.totalPages}
          />
        </div>
      </div>
    </section>
  )
}
