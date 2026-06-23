import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from '../../app/api/productsApi'
import { getProductFacetOptions } from '../../entities/product/lib/getProductFacetOptions'
import { HomeCatalog } from './components/HomeCatalog/HomeCatalog'
import { HomeSidebar } from './components/HomeSidebar/HomeSidebar'
import { HomeTopBar } from './components/HomeTopBar/HomeTopBar'
import styles from './HomePage.module.css'

export const HomePage = () => {
  const { data: products = [], isLoading: isProductsLoading } =
    useGetProductsQuery({
      page: 1,
      pageSize: 12,
    })
  const { data: allProducts = [], isLoading: isAllProductsLoading } =
    useGetAllProductsQuery()
  const isLoading = isProductsLoading || isAllProductsLoading
  const { categories, styleOptions, densityOptions } =
    getProductFacetOptions(allProducts)

  return (
    <section className={styles.page} aria-labelledby="home-title">
      <div className={styles.layout}>
        <HomeSidebar
          categories={categories}
          styleOptions={styleOptions}
          densityOptions={densityOptions}
        />

        <div className={styles.content}>
          <HomeTopBar />
          <HomeCatalog products={products} isLoading={isLoading} />
        </div>
      </div>
    </section>
  )
}
