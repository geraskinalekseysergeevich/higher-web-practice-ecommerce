import { useNavigate } from 'react-router-dom'

import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '../../app/api/cartApi'
import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { Button, Card, EmptyState } from '../../components/ui'
import { getCartLineItems } from '../../entities/cart/lib/getCartLineItems'
import { getCartSummary } from '../../entities/cart/lib/getCartSummary'
import styles from './CartPage.module.css'
import { CartItemRow } from './components/CartItemRow/CartItemRow'
import { CartSummary } from './components/CartSummary/CartSummary'

export const CartPage = () => {
  const navigate = useNavigate()
  const { data: cartItems = [], isLoading: isCartLoading } = useGetCartQuery()
  const { data: products = [], isLoading: isProductsLoading } =
    useGetAllProductsQuery()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeFromCart] = useRemoveFromCartMutation()

  const isLoading = isCartLoading || isProductsLoading
  const lineItems = getCartLineItems(cartItems, products)
  const summary = getCartSummary(lineItems)

  const handleIncrease = async (itemId: string, quantity: number) => {
    await updateCartItem({
      id: itemId,
      quantity: quantity + 1,
    })
  }

  const handleDecrease = async (itemId: string, quantity: number) => {
    if (quantity <= 1) {
      return removeFromCart(itemId)
    }

    return updateCartItem({
      id: itemId,
      quantity: quantity - 1,
    })
  }

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем корзину...</p>
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
        </h1>
        <p className={styles.subtitle}>
          {summary.totalItems} {summary.totalItems === 1 ? 'товар' : 'товаров'}
        </p>
      </div>

      <div className={styles.layout}>
        <Card className={styles.itemsCard}>
          <div className={styles.itemsList}>
            {lineItems.map((item) => (
              <CartItemRow
                key={item.id}
                image={item.image}
                name={item.name}
                unitPrice={item.unitPrice}
                quantity={item.quantity}
                totalPrice={item.totalPrice}
                onDecrease={() => handleDecrease(item.id, item.quantity)}
                onIncrease={() => handleIncrease(item.id, item.quantity)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
        </Card>

        <CartSummary
          totalItems={summary.totalItems}
          totalPrice={summary.totalPrice}
          onCheckout={() => navigate('/checkout')}
        />
      </div>

      <Card className={styles.noteCard}>
        <p className={styles.note}>
          Доставка и способы оплаты будут доступны на следующем шаге оформления.
        </p>
        <Button variant="secondary" type="button" onClick={() => navigate('/')}>
          Вернуться в каталог
        </Button>
      </Card>
    </section>
  )
}
