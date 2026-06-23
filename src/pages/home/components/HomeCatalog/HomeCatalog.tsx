import { Card } from '../../../../components/ui'
import type { Product } from '../../../../types'
import { HomePagination } from '../HomePagination/HomePagination'
import { HomeProductCard } from '../HomeProductCard/HomeProductCard'
import styles from './HomeCatalog.module.css'

type HomeCatalogProps = {
  products: Product[]
  isLoading: boolean
}

export const HomeCatalog = ({ products, isLoading }: HomeCatalogProps) => (
  <div className={styles.root}>
    <Card className={styles.catalog}>
      {isLoading ? (
        <p className={styles.loading}>Загружаем товары...</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <HomePagination />
    </Card>
  </div>
)
