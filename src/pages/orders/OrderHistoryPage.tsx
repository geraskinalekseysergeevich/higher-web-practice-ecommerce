import { skipToken } from '@reduxjs/toolkit/query'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useGetOrdersByUserIdQuery } from '../../app/api/ordersApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import {
  Card,
  DropdownIcon,
  EmptyState,
  ServerError,
} from '../../components/ui'
import {
  formatOrderDate,
  getDeliveryMethodLabel,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '../../entities/order/lib/orderDisplay'
import { sortOrdersByCreatedAt } from '../../entities/order/lib/sortOrdersByCreatedAt'
import styles from './OrderHistoryPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const OrderHistoryPage = () => {
  const navigate = useNavigate()
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  )
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const {
    data: orders = [],
    isError,
    isLoading,
    refetch,
  } = useGetOrdersByUserIdQuery(authenticatedUser?.id ?? skipToken)
  const visibleOrders = sortOrdersByCreatedAt(
    orders.filter((order) => order.userId === authenticatedUser?.id)
  )

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем историю заказов...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить историю заказов."
          onRetry={() => void refetch()}
        />
      </section>
    )
  }

  if (visibleOrders.length === 0) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="История заказов пуста"
          description="Здесь появятся ваши заказы после оформления."
          actionLabel="Перейти в каталог"
          onAction={() => navigate('/')}
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
        {visibleOrders.map((order) => {
          const isExpanded = Boolean(expandedOrders[order.id])
          const itemsId = `order-items-${order.id}`

          return (
            <Card
              key={order.id}
              className={styles.orderCard}
              data-expanded={isExpanded}
            >
              <div className={styles.details} data-expanded={isExpanded}>
                <div className={styles.summary}>
                  <div className={styles.summaryInfo}>
                    <div className={styles.summaryTopLine}>
                      <span className={styles.date}>
                        от {formatOrderDate(order.createdAt)}
                      </span>
                      <span className={styles.number}>№ {order.number}</span>
                    </div>
                    <div className={styles.statusLine}>
                      <span
                        className={styles.status}
                        data-status={order.status}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <span className={styles.deliveryLabel}>
                        {getDeliveryMethodLabel(
                          order.deliveryMethod
                        ).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.summaryAside}>
                    <span className={styles.price}>
                      {priceFormatter.format(order.totalPrice)} ₽
                    </span>
                    <span className={styles.payment}>
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div id={itemsId} className={styles.items} hidden={!isExpanded}>
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
                          {item.quantity} x {priceFormatter.format(item.price)}{' '}
                          ₽
                        </span>
                      </div>
                      <span className={styles.itemTotal}>
                        {priceFormatter.format(item.price * item.quantity)} ₽
                      </span>
                    </Link>
                  ))}
                </div>
                {isExpanded ? <div className={styles.divider} /> : null}

                <button
                  className={styles.toggleLabel}
                  type="button"
                  aria-controls={itemsId}
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedOrders((current) => ({
                      ...current,
                      [order.id]: !isExpanded,
                    }))
                  }
                >
                  <span>
                    {isExpanded
                      ? 'Свернуть товары'
                      : 'Показать товары в заказе'}
                  </span>
                  <DropdownIcon
                    className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconExpanded : ''}`}
                  />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
