import { skipToken } from '@reduxjs/toolkit/query'
import type { SyntheticEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetCartQuery, useRemoveFromCartMutation } from '../../app/api/cartApi'
import { useCreateOrderMutation } from '../../app/api/ordersApi'
import { useGetPickupPointsQuery } from '../../app/api/pickupPointsApi'
import { useGetAllProductsQuery } from '../../app/api/productsApi'
import { useGetUserByIdQuery } from '../../app/api/usersApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import {
  Button,
  Card,
  EmptyState,
  Input,
  ListButton,
  Radio,
  SectionHeading,
  SelectButton,
  Switch,
} from '../../components/ui'
import { getCartLineItems } from '../../entities/cart/lib/getCartLineItems'
import { getCartSummary } from '../../entities/cart/lib/getCartSummary'
import { buildOrderFromCheckout } from '../../entities/order/lib/buildOrderFromCheckout'
import styles from './CheckoutPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const { data: user } = useGetUserByIdQuery(authenticatedUser?.id ?? skipToken)
  const { data: cartItems = [] } = useGetCartQuery()
  const { data: products = [] } = useGetAllProductsQuery()
  const { data: pickupPoints = [] } = useGetPickupPointsQuery()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  )
  const [paymentMethod, setPaymentMethod] = useState<
    'card_online' | 'card_on_delivery' | 'cash'
  >('card_online')
  const [selectedPickupPointId, setSelectedPickupPointId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lineItems = useMemo(
    () => getCartLineItems(cartItems, products),
    [cartItems, products]
  )
  const summary = useMemo(() => getCartSummary(lineItems), [lineItems])
  const activePickupPointId = selectedPickupPointId || pickupPoints[0]?.id || ''
  const selectedPickupPoint = pickupPoints.find(
    (point) => point.id === activePickupPointId
  )

  const isEmptyCart = lineItems.length === 0
  const checkoutDisabled = isEmptyCart || !user || isSubmitting || isCreatingOrder

  const submitCheckout = async () => {
    if (!user || isEmptyCart) {
      return
    }

    const form = formRef.current

    if (!form) {
      return
    }

    const formData = new FormData(form)
    const paymentAddress =
      deliveryMethod === 'courier'
        ? {
            country: String(formData.get('country') ?? ''),
            city: String(formData.get('city') ?? ''),
            street: String(formData.get('street') ?? ''),
            house: String(formData.get('house') ?? ''),
            apartment: String(formData.get('apartment') ?? '') || undefined,
            postalCode: String(formData.get('postalCode') ?? '') || undefined,
          }
        : undefined

    setIsSubmitting(true)

    try {
      const order = buildOrderFromCheckout({
        user,
        lineItems,
        phone: String(formData.get('phone') ?? user.phone ?? ''),
        comment: String(formData.get('comment') ?? '') || undefined,
        paymentMethod,
        deliveryMethod,
        deliveryAddress: paymentAddress,
        pickupPointId: activePickupPointId || undefined,
      })

      const createdOrder = await createOrder(order).unwrap()

      navigate(`/confirmation/${createdOrder.id}`)

      void Promise.all(cartItems.map((item) => removeFromCart(item.id).unwrap()))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitCheckout()
  }

  if (!user) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем оформление заказа...</p>
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="checkout-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Корзина / Оформление заказа</p>
        <h1 id="checkout-title" className={styles.title}>
          Оформление заказа
        </h1>
      </header>

      <div className={styles.layout}>
        <Card className={styles.formCard}>
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <SectionHeading
              eyebrow="Покупатель"
              title="Контактные данные"
              description="Данные можно взять из профиля пользователя."
            />

            <div className={styles.formGrid}>
              <Input
                label="Имя"
                requiredMark
                defaultValue={user.firstName}
                name="firstName"
                autoComplete="given-name"
              />
              <Input
                label="Фамилия"
                requiredMark
                defaultValue={user.lastName}
                name="lastName"
                autoComplete="family-name"
              />
              <Input
                label="Email"
                requiredMark
                defaultValue={user.email}
                name="email"
                autoComplete="email"
              />
              <Input
                label="Телефон"
                requiredMark
                defaultValue={user.phone ?? ''}
                name="phone"
                autoComplete="tel"
                placeholder="+7 999 123-45-67"
              />
            </div>

            <label className={styles.commentField}>
              <span className={styles.commentLabel}>Комментарий к заказу</span>
              <textarea
                className={styles.commentInput}
                name="comment"
                rows={4}
              />
            </label>

            <section className={styles.section}>
              <SectionHeading
                eyebrow="Оплата"
                title="Способ оплаты"
                description="Выберите удобный вариант оплаты заказа."
              />

              <div className={styles.options}>
                <Radio
                  label="Картой онлайн"
                  name="paymentMethod"
                  checked={paymentMethod === 'card_online'}
                  onChange={() => setPaymentMethod('card_online')}
                />
                <Radio
                  label="Картой при получении"
                  name="paymentMethod"
                  checked={paymentMethod === 'card_on_delivery'}
                  onChange={() => setPaymentMethod('card_on_delivery')}
                />
                <Radio
                  label="Наличными"
                  name="paymentMethod"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
              </div>
            </section>

            <section className={styles.section}>
              <SectionHeading
                eyebrow="Доставка"
                title="Способ доставки"
                description="Либо курьер, либо пункт выдачи."
              />

              <div className={styles.options}>
                <Radio
                  label="Курьерская служба"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'courier'}
                  onChange={() => setDeliveryMethod('courier')}
                />
                <Radio
                  label="Пункт выдачи"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                />
              </div>

              {deliveryMethod === 'courier' ? (
                <div className={styles.deliveryGrid}>
                  <Input
                    label="Страна"
                    defaultValue="Россия"
                    name="country"
                  />
                  <Input label="Город" defaultValue="Москва" name="city" />
                  <Input label="Улица" defaultValue="Тверская" name="street" />
                  <Input label="Дом" defaultValue="7" name="house" />
                  <Input label="Квартира" defaultValue="15" name="apartment" />
                  <Input
                    label="Индекс"
                    defaultValue="125009"
                    name="postalCode"
                  />
                </div>
              ) : (
                <div className={styles.pickup}>
                  <SelectButton
                    label={selectedPickupPoint?.name ?? 'Выберите пункт выдачи'}
                    open={false}
                  />
                  <div className={styles.pickupList}>
                    {pickupPoints.map((point) => (
                      <ListButton
                        key={point.id}
                        label={`${point.name} · ${point.address}`}
                        selected={point.id === activePickupPointId}
                        onClick={() => setSelectedPickupPointId(point.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            <div className={styles.switchRow}>
              <Switch label="Получать уведомления на email" checked readOnly />
            </div>

            <Button
              className={styles.submit}
              type="submit"
              size="lg"
              fullWidth
              disabled={checkoutDisabled}
            >
              Подтвердить заказ
            </Button>
          </form>
        </Card>

        <Card className={styles.summaryCard}>
          <SectionHeading
            eyebrow="Сводка"
            title="Заказ"
            description="Показываем содержимое корзины и итоговую стоимость."
          />

          {isEmptyCart ? (
            <EmptyState
              title="Корзина пуста"
              description="Добавьте товары из каталога, чтобы увидеть сводку заказа."
              actionLabel="В каталог"
              onAction={() => navigate('/')}
            />
          ) : (
            <div className={styles.summary}>
              <div className={styles.summaryItems}>
                {lineItems.map((item) => (
                  <article key={item.id} className={styles.summaryItem}>
                    <img className={styles.summaryImage} src={item.image} alt="" />
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryName}>{item.name}</span>
                      <span className={styles.summaryMeta}>
                        {item.quantity} x {priceFormatter.format(item.unitPrice)} ₽
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <dl className={styles.totals}>
                <div className={styles.totalRow}>
                  <dt className={styles.totalTerm}>Товаров</dt>
                  <dd className={styles.totalValue}>{summary.totalItems}</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt className={styles.totalTerm}>Сумма</dt>
                  <dd className={styles.totalValue}>
                    {priceFormatter.format(summary.totalPrice)} ₽
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
