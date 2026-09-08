import { skipToken } from '@reduxjs/toolkit/query'
import clsx from 'clsx'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '../../../../app/api/cartApi'
import { selectAuthenticatedUser } from '../../../../app/auth/authSlice'
import { useAppSelector } from '../../../../app/hooks'
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
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const isAuthenticated = Boolean(authenticatedUser)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    data: cartItems = [],
    isError: isCartError,
    refetch: refetchCart,
  } = useGetCartQuery(authenticatedUser?.id ?? skipToken)
  const [addToCart] = useAddToCartMutation()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)
  const [cartError, setCartError] = useState('')
  const cartItemsByProductId = new Map(
    cartItems.map((item) => [item.productId, item])
  )

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: location.pathname, search: location.search },
        },
      })
      return
    }

    setPendingProductId(productId)
    setCartError('')

    try {
      await addToCart({
        productId,
        userId: authenticatedUser?.id ?? '',
      }).unwrap()
    } catch {
      setCartError('Не удалось обновить корзину')
    } finally {
      setPendingProductId(null)
    }
  }

  const handleIncrease = async (productId: string) => {
    const item = cartItemsByProductId.get(productId)

    setPendingProductId(productId)
    setCartError('')

    try {
      if (!item) {
        await handleAddToCart(productId)
        return
      }

      await updateCartItem({
        id: item.id,
        quantity: item.quantity + 1,
      }).unwrap()
    } catch {
      setCartError('Не удалось обновить корзину')
    } finally {
      setPendingProductId(null)
    }
  }

  const handleDecrease = async (productId: string) => {
    const item = cartItemsByProductId.get(productId)

    if (!item) return

    setPendingProductId(productId)
    setCartError('')

    try {
      if (item.quantity <= 1) {
        await removeFromCart(item.id).unwrap()
        return
      }

      await updateCartItem({
        id: item.id,
        quantity: item.quantity - 1,
      }).unwrap()
    } catch {
      setCartError('Не удалось обновить корзину')
    } finally {
      setPendingProductId(null)
    }
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

        {isCartError ? (
          <ServerError
            message="Не удалось загрузить корзину."
            onRetry={() => void refetchCart()}
          />
        ) : null}
        {cartError ? <p role="alert">{cartError}</p> : null}

        <HomePagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </Card>
    </div>
  )
}
