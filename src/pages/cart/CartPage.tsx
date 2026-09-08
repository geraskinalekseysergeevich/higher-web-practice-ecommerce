import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '../../app/api/cartApi'
import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import { Card, EmptyState, ServerError } from '../../components/ui'
import { getCartLineItems } from '../../entities/cart/lib/getCartLineItems'
import { getCartSummary } from '../../entities/cart/lib/getCartSummary'
import styles from './CartPage.module.css'
import { CartItemRow } from './components/CartItemRow/CartItemRow'
import { CartSummary } from './components/CartSummary/CartSummary'

export const CartPage = () => {
  const navigate = useNavigate()
  const user = useAppSelector(selectAuthenticatedUser)
  const {
    data: cartItems = [],
    isError: isCartError,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useGetCartQuery(user?.id ?? '')
  const {
    data: products = [],
    isError: isProductsError,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery()
  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation()
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation()
  const [mutationError, setMutationError] = useState('')

  const isLoading = isCartLoading || isProductsLoading
  const lineItems = getCartLineItems(cartItems, products)
  const summary = getCartSummary(lineItems)
  const hasUnavailableItems = lineItems.some((item) => !item.inStock)

  const handleIncrease = async (itemId: string, quantity: number) => {
    setMutationError('')
    try {
      await updateCartItem({
        id: itemId,
        quantity: quantity + 1,
      }).unwrap()
    } catch {
      setMutationError('Не удалось изменить количество товара.')
    }
  }

  const handleDecrease = async (itemId: string, quantity: number) => {
    setMutationError('')
    try {
      if (quantity <= 1) {
        await removeFromCart(itemId).unwrap()
        return
      }

      await updateCartItem({
        id: itemId,
        quantity: quantity - 1,
      }).unwrap()
    } catch {
      setMutationError('Не удалось изменить количество товара.')
    }
  }

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем корзину...</p>
      </section>
    )
  }

  if (isCartError || isProductsError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить корзину."
          onRetry={() => {
            if (isCartError) void refetchCart()
            if (isProductsError) void refetchProducts()
          }}
        />
      </section>
    )
  }

  if (lineItems.length === 0) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="Корзина пуста"
          description="Добавьте товары из каталога, чтобы перейти к оформлению заказа."
          actionLabel="Перейти в каталог"
          onAction={() => navigate('/')}
        />
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="cart-title">
      <div className={styles.header}>
        <h1 id="cart-title" className={styles.title}>
          Корзина
          <span className={styles.subtitle}>{summary.totalItems} товара</span>
        </h1>
      </div>

      {mutationError ? <p role="alert">{mutationError}</p> : null}
      {hasUnavailableItems ? (
        <p role="alert">Удалите недоступные товары перед оформлением заказа.</p>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {lineItems.map((item) => (
            <Card key={item.id} className={styles.itemCard}>
              <CartItemRow
                image={item.image}
                isMissing={item.isMissing}
                inStock={item.inStock}
                name={item.name}
                productId={item.productId}
                unitPrice={item.unitPrice}
                quantity={item.quantity}
                totalPrice={item.totalPrice}
                onDecrease={() => handleDecrease(item.id, item.quantity)}
                onIncrease={() => handleIncrease(item.id, item.quantity)}
                onRemove={() => {
                  setMutationError('')
                  void removeFromCart(item.id)
                    .unwrap()
                    .catch(() => {
                      setMutationError('Не удалось удалить товар из корзины.')
                    })
                }}
                disabled={isUpdating || isRemoving}
              />
            </Card>
          ))}
        </div>

        <CartSummary
          totalItems={summary.totalItems}
          totalPrice={summary.totalPrice}
          checkoutDisabled={hasUnavailableItems}
          onCheckout={() => navigate('/checkout')}
        />
      </div>
    </section>
  )
}
