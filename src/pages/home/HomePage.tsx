import clsx from 'clsx'
import { type FormEvent, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { Search } from '../../components/layout/Search/Search'
import { FilterIcon } from '../../components/ui'
import { getProductFacetOptions } from '../../entities/product/lib/getProductFacetOptions'
import type { ProductSort } from '../../types'
import { MobileFilters } from '../category/components/MobileFilters'
import { HomeCatalog } from './components/HomeCatalog/HomeCatalog'
import { HomeSidebar } from './components/HomeSidebar/HomeSidebar'
import { HomeTopBar } from './components/HomeTopBar/HomeTopBar'
import styles from './HomePage.module.css'
import { getVisibleHomeProducts } from './lib/homeProducts'
import { clearSearchQuery } from './lib/homeSearch'
import { parsePriceParam } from './lib/parsePriceParam'

type HomePageProps = {
  category?: string
  subcategory?: string
  categoryView?: boolean
}

export const HomePage = ({
  category: categoryFromPath,
  subcategory: subcategoryFromPath,
  categoryView = false,
}: HomePageProps = {}) => {
  const {
    data: allProducts = [],
    isError: isAllProductsError,
    isLoading: isAllProductsLoading,
  } = useGetAllProductsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, styleOptions, densityOptions, subcategoriesByCategory } =
    getProductFacetOptions(allProducts)

  const selectedCategory =
    searchParams.get('category') ?? categoryFromPath ?? undefined
  const selectedSubcategory =
    searchParams.get('subcategory') ?? subcategoryFromPath ?? undefined
  const selectedStyles = searchParams.getAll('style')
  const query = searchParams.get('q') ?? ''
  const selectedDensity = searchParams.get('density') ?? undefined
  const inStockOnly = searchParams.get('inStock') === '1'
  const ratedOnly = searchParams.get('rated') === '1'
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const currentPage = Math.max(
    1,
    Number.parseInt(searchParams.get('page') ?? '1', 10) || 1
  )
  const sortParam = searchParams.get('sort')
  const viewParam = searchParams.get('view')
  const sort: ProductSort =
    sortParam === 'price_asc' ||
    sortParam === 'price_desc' ||
    sortParam === 'newest' ||
    sortParam === 'rating'
      ? sortParam
      : 'newest'
  const view = viewParam === 'list' ? 'list' : 'table'
  const mobilePanelParam = searchParams.get('mobilePanel')
  const mobilePanel =
    categoryView &&
    (mobilePanelParam === 'filters' || mobilePanelParam === 'style')
      ? mobilePanelParam
      : undefined

  const visibleProducts = useMemo(
    () =>
      getVisibleHomeProducts(allProducts, {
        query,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        styles: selectedStyles,
        density: selectedDensity,
        inStockOnly,
        ratedOnly,
        minPrice: minPrice ? parsePriceParam(minPrice) : undefined,
        maxPrice: maxPrice ? parsePriceParam(maxPrice) : undefined,
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
      query,
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = String(
      new FormData(event.currentTarget).get('search') ?? ''
    ).trim()

    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams)

      if (nextQuery) {
        params.set('q', nextQuery)
      } else {
        params.delete('q')
      }

      params.set('page', '1')
      return params
    })
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
      params.delete('q')
      params.set('page', '1')

      return params
    })
  }

  const clearSearch = () => {
    setSearchParams(clearSearchQuery(searchParams))
  }

  const closeMobilePanel = () => {
    updateSearchParams((params) => {
      params.delete('mobilePanel')
      return params
    })
  }

  const setMobilePanel = (panel: 'filters' | 'style') => {
    updateSearchParams((params) => {
      params.set('mobilePanel', panel)
      return params
    })
  }

  const activeFilters = [
    ...(selectedCategory
      ? [
          {
            id: 'category',
            label: `Категория: ${selectedCategory}`,
            onRemove: () =>
              updateSearchParams((params) => {
                params.delete('category')
                params.delete('subcategory')
                params.set('page', '1')
                return params
              }),
          },
        ]
      : []),
    ...(selectedSubcategory
      ? [
          {
            id: 'subcategory',
            label: `Подкатегория: ${selectedSubcategory}`,
            onRemove: () => setSingleParam('subcategory'),
          },
        ]
      : []),
    ...selectedStyles.map((style) => ({
      id: `style-${style}`,
      label: `Стиль: ${style}`,
      onRemove: () => toggleStyle(style),
    })),
    ...(selectedDensity
      ? [
          {
            id: 'density',
            label: `Густота: ${selectedDensity}`,
            onRemove: () => setSingleParam('density'),
          },
        ]
      : []),
    ...(inStockOnly
      ? [
          {
            id: 'in-stock',
            label: 'В наличии',
            onRemove: () => setBooleanParam('inStock', false),
          },
        ]
      : []),
    ...(ratedOnly
      ? [
          {
            id: 'rated',
            label: 'С рейтингом',
            onRemove: () => setBooleanParam('rated', false),
          },
        ]
      : []),
    ...(minPrice
      ? [
          {
            id: 'min-price',
            label: `Цена от: ${minPrice} ₽`,
            onRemove: () => setSingleParam('minPrice'),
          },
        ]
      : []),
    ...(maxPrice
      ? [
          {
            id: 'max-price',
            label: `Цена до: ${maxPrice} ₽`,
            onRemove: () => setSingleParam('maxPrice'),
          },
        ]
      : []),
  ]

  return (
    <section
      className={clsx(styles.page, categoryView && styles.categoryPage)}
      aria-labelledby="home-title"
    >
      <Search
        className={styles.mobileSearch}
        compact
        key={searchParams.toString()}
        defaultValue={query}
        onClear={clearSearch}
        onSubmit={handleSearch}
      />
      {categoryView && mobilePanel ? (
        <MobileFilters
          densityOptions={densityOptions}
          inStockOnly={inStockOnly}
          maxPrice={maxPrice}
          minPrice={minPrice}
          mode={mobilePanel}
          ratedOnly={ratedOnly}
          selectedDensity={selectedDensity}
          selectedStyles={selectedStyles}
          styleOptions={styleOptions}
          onApply={closeMobilePanel}
          onBack={
            mobilePanel === 'style'
              ? () => setMobilePanel('filters')
              : closeMobilePanel
          }
          onDensityChange={(density) => setSingleParam('density', density)}
          onInStockChange={(value) => setBooleanParam('inStock', value)}
          onMaxPriceChange={(value) => setSingleParam('maxPrice', value)}
          onMinPriceChange={(value) => setSingleParam('minPrice', value)}
          onOpenStyle={() => setMobilePanel('style')}
          onRatedChange={(value) => setBooleanParam('rated', value)}
          onStyleToggle={toggleStyle}
        />
      ) : null}
      {categoryView && !mobilePanel ? (
        <div className={styles.mobileCategoryHeader}>
          <div className={styles.breadcrumb}>
            <span>Усы</span>
            <span>/</span>
            <span>{selectedCategory}</span>
          </div>
          <div className={styles.categoryTitle}>
            <h1>{selectedSubcategory}</h1>
            <button
              className={styles.filterButton}
              type="button"
              aria-label="Открыть фильтры"
              onClick={() => setMobilePanel('filters')}
            >
              <FilterIcon />
            </button>
          </div>
        </div>
      ) : null}
      <div
        className={clsx(styles.layout, mobilePanel && styles.mobilePanelOpen)}
      >
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
          {activeFilters.length > 0 ? (
            <div className={styles.filters} aria-label="Выбранные фильтры">
              {activeFilters.map((filter) => (
                <button
                  key={filter.id}
                  aria-label={`Убрать фильтр «${filter.label}»`}
                  className={styles.filter}
                  onClick={filter.onRemove}
                  type="button"
                >
                  <span>{filter.label}</span>
                  <span aria-hidden="true" className={styles.filterClose}>
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          <HomeCatalog
            currentPage={
              visibleProducts.totalPages < currentPage
                ? visibleProducts.totalPages
                : currentPage
            }
            isLoading={isAllProductsLoading}
            isError={isAllProductsError}
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
