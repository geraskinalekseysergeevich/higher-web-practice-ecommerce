import { skipToken } from '@reduxjs/toolkit/query'
import { Link } from 'react-router-dom'

import { useGetOrdersByUserIdQuery } from '../../app/api/ordersApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import { Card, EmptyState } from '../../components/ui'
import {
  formatOrderDate,
  getDeliveryMethodLabel,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '../../entities/order/lib/orderDisplay'
import styles from './OrderHistoryPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const OrderHistoryPage = () => {
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const { data: orders = [], isLoading } = useGetOrdersByUserIdQuery(
    authenticatedUser?.id ?? skipToken
  )

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем историю заказов...</p>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="История заказов пуста"
          description="Здесь появятся ваши заказы после оформления."
          actionLabel="Перейти в каталог"
          onAction={() => window.location.assign('/')}
        />
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="orders-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Личный кабинет</p>
        <h1 id="orders-title" className={styles.title}>
          История заказов
        </h1>
      </header>

      <div className={styles.list}>
        {orders.map((order) => (
          <Card key={order.id} className={styles.orderCard}>
            <details className={styles.details} open>
              <summary className={styles.summary}>
                <div className={styles.summaryMeta}>
                  <span className={styles.number}>{order.number}</span>
                  <span className={styles.date}>
                    {formatOrderDate(order.createdAt)}
                  </span>
                </div>

                <div className={styles.summaryMeta}>
                  <span className={styles.status}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <span className={styles.price}>
                    {priceFormatter.format(order.totalPrice)} ₽
                  </span>
                </div>
              </summary>

              <div className={styles.metaGrid}>
                <div>
                  <span className={styles.metaLabel}>Оплата</span>
                  <span className={styles.metaValue}>
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Доставка</span>
                  <span className={styles.metaValue}>
                    {getDeliveryMethodLabel(order.deliveryMethod)}
                  </span>
                </div>
              </div>

              <div className={styles.items}>
                {order.items.map((item) => (
                  <Link
                    key={`${order.id}-${item.productId}`}
                    className={styles.item}
                    to={`/product/${item.productId}`}
                  >
                    <img className={styles.itemImage} src={item.image} alt="" />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemMeta}>
                        {item.quantity} x {priceFormatter.format(item.price)} ₽
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          </Card>
        ))}
      </div>
    </section>
  )
}
