import { Link, useNavigate, useParams } from 'react-router-dom'

import { useGetOrderByIdQuery } from '../../app/api/ordersApi'
import { useGetPickupPointByIdQuery } from '../../app/api/pickupPointsApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import { Card, EmptyState, ServerError } from '../../components/ui'
import { getDeliveryEstimate } from '../../entities/order/lib/checkoutValidation'
import {
  getDeliveryMethodLabel,
  getPaymentMethodLabel,
} from '../../entities/order/lib/orderDisplay'
import styles from './OrderConfirmationPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const OrderConfirmationPage = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const {
    data: order,
    isError,
    isLoading,
    refetch: refetchOrder,
  } = useGetOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })
  const {
    data: pickupPoint,
    isError: isPickupPointError,
    isLoading: isPickupPointLoading,
    refetch: refetchPickupPoint,
  } = useGetPickupPointByIdQuery(order?.pickupPointId ?? '', {
    skip: !order?.pickupPointId,
  })

  const isOrderVisible = order && order.userId === authenticatedUser?.id

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем подтверждение заказа...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить подтверждение заказа."
          onRetry={() => void refetchOrder()}
        />
      </section>
    )
  }

  if (!isOrderVisible) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="Заказ не найден"
          description="Проверьте номер заказа или перейдите в историю заказов."
          actionLabel="В историю заказов"
          onAction={() => navigate('/profile/orders')}
        />
      </section>
    )
  }

  if (isPickupPointLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем пункт выдачи...</p>
      </section>
    )
  }

  if (isPickupPointError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить пункт выдачи."
          onRetry={() => void refetchPickupPoint()}
        />
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="confirmation-title">
      <header className={styles.header}>
        <h1 id="confirmation-title" className={styles.title}>
          Спасибо за покупку!
        </h1>
        <p className={styles.subtitle}>
          Мы уже готовим выбранные усы к отправке!
        </p>
      </header>

      <Card className={styles.summaryCard}>
        <div className={styles.recipient}>
          <h2 className={styles.blockTitle}>Получатель</h2>
          <div className={styles.recipientLine}>
            <span className={styles.blockText}>
              {order.customer.firstName} {order.customer.lastName}
            </span>
            <span className={styles.blockText}>{order.customer.email}</span>
            <span className={styles.blockText}>{order.customer.phone}</span>
          </div>
          {order.comment ? (
            <p className={styles.blockText}>{order.comment}</p>
          ) : null}
        </div>

        <div className={styles.delivery}>
          <div className={styles.block}>
            <span className={styles.summaryLabel}>Способ доставки</span>
            <span className={styles.blockText}>
              {getDeliveryMethodLabel(order.deliveryMethod)}
            </span>
            <span className={styles.blockText}>
              {order.deliveryAddress
                ? `${order.deliveryAddress.city}, ${order.deliveryAddress.street}, ${order.deliveryAddress.house}`
                : (pickupPoint?.address ?? pickupPoint?.name ?? 'Пункт выдачи')}
            </span>
          </div>
          <div className={styles.block}>
            <span className={styles.summaryLabel}>
              {order.deliveryMethod === 'pickup_point'
                ? 'Забирать после'
                : 'Срок доставки'}
            </span>
            <span className={styles.blockText}>
              {order.deliveryMethod === 'pickup_point'
                ? getDeliveryEstimate('pickup')
                : getDeliveryEstimate('courier')}
            </span>
          </div>
        </div>

        <div className={styles.itemsList}>
          {order.items.map((item) => (
            <Link
              key={`${order.id}-${item.productId}`}
              className={styles.item}
              to={`/product/${item.productId}`}
            >
              <img
                className={styles.itemImage}
                src={item.image || '/product-placeholder.svg'}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = '/product-placeholder.svg'
                }}
              />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemMeta}>
                  <strong className={styles.itemPrice}>
                    {priceFormatter.format(item.price * item.quantity)} ₽
                  </strong>
                  {item.quantity} шт.
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.totalRow}>
          <div className={styles.totalBlock}>
            <span className={styles.summaryLabel}>Общая сумма</span>
            <strong className={styles.summaryValue}>
              {priceFormatter.format(order.totalPrice)} ₽
            </strong>
          </div>
          <div className={styles.paymentBlock}>
            <span className={styles.summaryLabel}>Оплачено</span>
            <strong className={styles.paymentValue}>
              {getPaymentMethodLabel(order.paymentMethod)}
            </strong>
          </div>
        </div>
      </Card>

      <div className={styles.actions}>
        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => window.print()}
        >
          Распечатать
        </button>
        <Link className={styles.secondaryAction} to="/profile/orders">
          Все заказы
        </Link>
      </div>
    </section>
  )
}
