import { useParams, useSearchParams } from 'react-router-dom'

import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { getProductFacetOptions } from '../../entities/product/lib/getProductFacetOptions'
import { HomePage } from '../home/HomePage'
import styles from './CategoryProductPage.module.css'
import { MobileCategoryBrowser } from './components/MobileCategoryBrowser'
import { decodeParam } from './lib/categoryPaths'

export const CategoryProductPage = () => {
  const { category, subcategory, productSubcategory } = useParams()
  const { data: products = [] } = useGetAllProductsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, subcategoriesByCategory } =
    getProductFacetOptions(products)
  const decodedCategory = decodeParam(category)
  const decodedSubcategory = decodeParam(subcategory)
  const decodedProductSubcategory = decodeParam(productSubcategory)
  const isProductList = Boolean(decodedProductSubcategory)
  const isRootCategory = decodedCategory === 'Усы'

  const desktopCategory = isProductList
    ? decodedSubcategory
    : isRootCategory
      ? undefined
      : decodedCategory
  const desktopSubcategory = isProductList
    ? decodedProductSubcategory
    : isRootCategory
      ? undefined
      : decodedSubcategory

  return (
    <div className={styles.page}>
      <div className={styles.mobile}>
        {isProductList ? (
          <HomePage
            category={decodedSubcategory}
            categoryView
            subcategory={decodedProductSubcategory}
          />
        ) : (
          <MobileCategoryBrowser
            categories={categories}
            category={decodedCategory}
            subcategoriesByCategory={subcategoriesByCategory}
            subcategory={decodedSubcategory}
            searchQuery={searchParams.get('q') ?? ''}
            onSearch={(query) => {
              const nextParams = new URLSearchParams(searchParams)

              if (query) {
                nextParams.set('q', query)
              } else {
                nextParams.delete('q')
              }

              nextParams.set('page', '1')
              setSearchParams(nextParams)
            }}
          />
        )}
      </div>

      <div className={styles.desktop}>
        <HomePage
          category={desktopCategory}
          categoryView={Boolean(desktopCategory)}
          subcategory={desktopSubcategory}
        />
      </div>
    </div>
  )
}
