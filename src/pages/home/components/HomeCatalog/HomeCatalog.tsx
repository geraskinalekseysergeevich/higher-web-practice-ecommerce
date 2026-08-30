import clsx from 'clsx'
import { useState } from 'react'

import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '../../../../app/api/cartApi'
import { Card, EmptyState, ServerError } from '../../../../components/ui'
import type { Product } from '../../../../types'
import { HomePagination } from '../HomePagination/HomePagination'
import { HomeProductCard } from '../HomeProductCard/HomeProductCard'
import styles from './HomeCatalog.module.css'

type HomeCatalogProps = {
  products: Product[]
  isLoading: boolean
  isError: boolean
  currentPage: number
  totalPages: number
  view: 'list' | 'table'
  onPageChange: (page: number) => void
  onClearFilters: () => void
}

export const HomeCatalog = ({
  products,
  isError,
  isLoading,
  currentPage,
  totalPages,
  view,
  onPageChange,
  onClearFilters,
}: HomeCatalogProps) => {
  const { data: cartItems = [] } = useGetCartQuery()
  const [addToCart] = useAddToCartMutation()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)
  const cartItemsByProductId = new Map(
    cartItems.map((item) => [item.productId, item])
  )

  const handleAddToCart = async (productId: string) => {
    setPendingProductId(productId)

    try {
      await addToCart({ productId }).unwrap()
    } catch {
      // Keep the UI responsive even if the mock API request fails.
    } finally {
      setPendingProductId(null)
    }
  }

  const handleIncrease = async (productId: string) => {
    const item = cartItemsByProductId.get(productId)

    if (!item) {
      return handleAddToCart(productId)
    }

    await updateCartItem({
      id: item.id,
      quantity: item.quantity + 1,
    })
  }

  const handleDecrease = async (productId: string) => {
    const item = cartItemsByProductId.get(productId)

    if (!item) {
      return
    }

    if (item.quantity <= 1) {
      await removeFromCart(item.id)
      return
    }

    await updateCartItem({
      id: item.id,
      quantity: item.quantity - 1,
    })
  }

  return (
    <div className={styles.root}>
      <Card className={styles.catalog}>
        {isLoading ? (
          <p className={styles.loading}>Загружаем товары...</p>
        ) : isError ? (
          <ServerError message="Не удалось загрузить товары. Проверьте, что запущен локальный сервер данных." />
        ) : products.length === 0 ? (
          <EmptyState
            title="Товары не найдены"
            description="Попробуйте изменить фильтры или сбросить их, чтобы увидеть больше вариантов."
            actionLabel="Сбросить фильтры"
            onAction={onClearFilters}
          />
        ) : (
          <div
            className={clsx(styles.grid, view === 'list' && styles.list)}
            data-testid="home-catalog-grid"
            data-view={view}
          >
            {products.map((product) => (
              <HomeProductCard
                key={product.id}
                view={view}
                product={product}
                quantity={cartItemsByProductId.get(product.id)?.quantity ?? 0}
                onAddToCart={handleAddToCart}
                onDecrease={() => handleDecrease(product.id)}
                onIncrease={() => handleIncrease(product.id)}
                isAddingToCart={pendingProductId === product.id}
              />
            ))}
          </div>
        )}

        <HomePagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </Card>
    </div>
  )
}
