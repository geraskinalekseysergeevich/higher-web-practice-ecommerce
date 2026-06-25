import { Link, useParams } from 'react-router-dom'

import { useGetOrderByIdQuery } from '../../app/api/ordersApi'
import { useGetPickupPointByIdQuery } from '../../app/api/pickupPointsApi'
import { Card, EmptyState } from '../../components/ui'
import {
  formatOrderDate,
  getDeliveryMethodLabel,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '../../entities/order/lib/orderDisplay'
import styles from './OrderConfirmationPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })
  const { data: pickupPoint } = useGetPickupPointByIdQuery(
    order?.pickupPointId ?? '',
    {
      skip: !order?.pickupPointId,
    }
  )

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем подтверждение заказа...</p>
      </section>
    )
  }

  if (!order) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="Заказ не найден"
          description="Проверьте номер заказа или перейдите в историю заказов."
          actionLabel="В историю заказов"
          onAction={() => window.location.assign('/orders')}
        />
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="confirmation-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Заказ оформлен</p>
        <h1 id="confirmation-title" className={styles.title}>
          Спасибо, заказ принят
        </h1>
        <p className={styles.subtitle}>
          Номер {order.number} · {formatOrderDate(order.createdAt)}
        </p>
      </header>

      <div className={styles.layout}>
        <Card className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <span className={styles.summaryLabel}>Статус</span>
              <span className={styles.summaryValue}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <div>
              <span className={styles.summaryLabel}>Сумма</span>
              <span className={styles.summaryValue}>
                {priceFormatter.format(order.totalPrice)} ₽
              </span>
            </div>
          </div>

          <div className={styles.blocks}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Покупатель</h2>
              <p className={styles.blockText}>
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className={styles.blockText}>{order.customer.email}</p>
              <p className={styles.blockText}>{order.customer.phone}</p>
            </div>

            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Доставка и оплата</h2>
              <p className={styles.blockText}>
                {getDeliveryMethodLabel(order.deliveryMethod)}
              </p>
              <p className={styles.blockText}>
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              {order.deliveryAddress ? (
                <p className={styles.blockText}>
                  {order.deliveryAddress.city}, {order.deliveryAddress.street},{' '}
                  {order.deliveryAddress.house}
                </p>
              ) : null}
              {pickupPoint ? (
                <p className={styles.blockText}>
                  {pickupPoint.name} · {pickupPoint.address}
                </p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className={styles.itemsCard}>
          <h2 className={styles.itemsTitle}>Состав заказа</h2>

          <div className={styles.itemsList}>
            {order.items.map((item) => (
              <article key={`${order.id}-${item.productId}`} className={styles.item}>
                <img className={styles.itemImage} src={item.image} alt="" />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemMeta}>
                    {item.quantity} x {priceFormatter.format(item.price)} ₽
                  </span>
                </div>
                <span className={styles.itemTotal}>
                  {priceFormatter.format(item.price * item.quantity)} ₽
                </span>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <Link className={styles.secondaryAction} to="/orders">
              К истории заказов
            </Link>
            <Link className={styles.primaryAction} to="/">
              В каталог
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
