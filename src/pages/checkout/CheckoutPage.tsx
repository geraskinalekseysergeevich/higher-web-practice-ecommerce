import { skipToken } from '@reduxjs/toolkit/query'
import type { ChangeEvent, SyntheticEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from '../../app/api/cartApi'
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
  SectionHeading,
  SelectButton,
  Switch,
} from '../../components/ui'
import { getCartLineItems } from '../../entities/cart/lib/getCartLineItems'
import { getCartSummary } from '../../entities/cart/lib/getCartSummary'
import { buildOrderFromCheckout } from '../../entities/order/lib/buildOrderFromCheckout'
import {
  type CheckoutFieldErrors,
  clearCheckoutFieldError,
  getDeliveryEstimate,
  validateCheckoutValues,
} from '../../entities/order/lib/checkoutValidation'
import { formatPhoneNumber } from '../../entities/order/lib/formatPhoneNumber'
import styles from './CheckoutPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

const paymentOptions = [
  { value: 'card_online' as const, label: 'Картой онлайн' },
  { value: 'card_on_delivery' as const, label: 'Картой при получении' },
  { value: 'cash' as const, label: 'Наличными при получении' },
]

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserByIdQuery(authenticatedUser?.id ?? skipToken)
  const {
    data: cartItems = [],
    isError: isCartError,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useGetCartQuery(authenticatedUser?.id ?? '')
  const {
    data: products = [],
    isError: isProductsError,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery()
  const {
    data: pickupPoints = [],
    isError: isPickupPointsError,
    isLoading: isPickupPointsLoading,
    refetch: refetchPickupPoints,
  } = useGetPickupPointsQuery()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  )
  const [paymentMethod, setPaymentMethod] = useState<
    'card_online' | 'card_on_delivery' | 'cash'
  >('card_online')
  const [selectedPickupPointId, setSelectedPickupPointId] = useState('')
  const [isPickupOpen, setIsPickupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({})
  const [serverError, setServerError] = useState('')

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
  const hasUnavailableItems = lineItems.some((item) => !item.inStock)
  const checkoutDisabled =
    isEmptyCart ||
    hasUnavailableItems ||
    !user ||
    isSubmitting ||
    isCreatingOrder

  const submitCheckout = async () => {
    if (!user || isEmptyCart) {
      return
    }

    const form = formRef.current

    if (!form) {
      return
    }

    const formData = new FormData(form)
    const validationErrors = validateCheckoutValues({
      phone: String(formData.get('phone') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      deliveryMethod,
      country: String(formData.get('country') ?? ''),
      city: String(formData.get('city') ?? ''),
      street: String(formData.get('street') ?? ''),
      house: String(formData.get('house') ?? ''),
      pickupPointId: activePickupPointId,
    })

    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setServerError('')
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
        customer: {
          firstName: String(formData.get('firstName') ?? ''),
          lastName: String(formData.get('lastName') ?? ''),
          email: String(formData.get('email') ?? ''),
        },
        phone: String(formData.get('phone') ?? user.phone ?? ''),
        comment: String(formData.get('comment') ?? '') || undefined,
        paymentMethod,
        deliveryMethod,
        deliveryAddress: paymentAddress,
        pickupPointId: activePickupPointId || undefined,
      })

      const createdOrder = await createOrder(order).unwrap()

      try {
        await Promise.all(
          cartItems.map((item) => removeFromCart(item.id).unwrap())
        )
      } catch {
        setServerError(
          'Заказ создан, но корзину не удалось очистить. Обновите страницу и удалите оставшиеся товары.'
        )
        return
      }
      navigate(`/confirmation/${createdOrder.id}`)
    } catch {
      setServerError('Не удалось оформить заказ. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitCheckout()
  }

  const handleFieldChange = (field: keyof CheckoutFieldErrors) => {
    setFieldErrors((current) => clearCheckoutFieldError(current, field))
  }

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = formatPhoneNumber(event.currentTarget.value)
    handleFieldChange('phone')
  }

  if (isUserError || isCartError || isProductsError || isPickupPointsError) {
    return (
      <section className={styles.page}>
        <p className={styles.serverError} role="alert">
          Не удалось загрузить оформление заказа.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (isUserError) void refetchUser()
            if (isCartError) void refetchCart()
            if (isProductsError) void refetchProducts()
            if (isPickupPointsError) void refetchPickupPoints()
          }}
        >
          Повторить
        </Button>
      </section>
    )
  }

  if (
    isUserLoading ||
    isCartLoading ||
    isProductsLoading ||
    isPickupPointsLoading
  ) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем оформление заказа...</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем оформление заказа...</p>
      </section>
    )
  }

  if (isEmptyCart) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="Корзина пуста"
          description="Добавьте товары в корзину, чтобы оформить заказ."
          actionLabel="Перейти в корзину"
          onAction={() => navigate('/profile/cart')}
        />
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
        <div className={styles.formCard}>
          {serverError ? (
            <p className={styles.serverError} role="alert">
              {serverError}
            </p>
          ) : null}
          <form
            id="checkout-form"
            ref={formRef}
            className={styles.form}
            noValidate
            onSubmit={handleSubmit}
          >
            <section className={styles.section}>
              <SectionHeading compact title="Способ оплаты" />

              <div className={`${styles.options} ${styles.paymentOptions}`}>
                <div className={styles.paymentTop}>
                  {paymentOptions.slice(0, 2).map(({ value, label }) => (
                    <label
                      key={value}
                      className={styles.choice}
                      data-selected={paymentMethod === value}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {paymentOptions.slice(2).map(({ value, label }) => (
                  <label
                    key={value}
                    className={styles.choice}
                    data-selected={paymentMethod === value}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <SectionHeading compact title="Способ доставки" />

              <div className={styles.options}>
                {[
                  ['courier', 'Курьером'],
                  ['pickup', 'В пункт выдачи'],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className={styles.choice}
                    data-selected={deliveryMethod === value}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={value}
                      checked={deliveryMethod === value}
                      onChange={() =>
                        setDeliveryMethod(value as 'courier' | 'pickup')
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {deliveryMethod === 'courier' ? (
                <div className={styles.deliveryGrid}>
                  <Input
                    label="Страна"
                    requiredMark
                    defaultValue="Россия"
                    error={fieldErrors.country}
                    name="country"
                    onChange={() => handleFieldChange('country')}
                    required
                  />
                  <Input
                    label="Город"
                    requiredMark
                    defaultValue="Москва"
                    error={fieldErrors.city}
                    name="city"
                    onChange={() => handleFieldChange('city')}
                    required
                  />
                  <Input
                    label="Улица"
                    requiredMark
                    defaultValue="Тверская"
                    error={fieldErrors.street}
                    name="street"
                    onChange={() => handleFieldChange('street')}
                    required
                  />
                  <Input
                    label="Дом"
                    requiredMark
                    defaultValue="7"
                    error={fieldErrors.house}
                    name="house"
                    onChange={() => handleFieldChange('house')}
                    required
                  />
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
                    open={isPickupOpen}
                    onClick={() => setIsPickupOpen((open) => !open)}
                  />
                  {isPickupOpen ? (
                    <div className={styles.pickupList}>
                      {pickupPoints.map((point) => (
                        <ListButton
                          key={point.id}
                          label={`${point.name} · ${point.address}`}
                          selected={point.id === activePickupPointId}
                          onClick={() => {
                            setSelectedPickupPointId(point.id)
                            setIsPickupOpen(false)
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                  {fieldErrors.pickupPointId ? (
                    <p className={styles.fieldError} role="alert">
                      {fieldErrors.pickupPointId}
                    </p>
                  ) : null}
                </div>
              )}

              <p className={styles.deliveryEstimate}>
                Срок доставки: {getDeliveryEstimate(deliveryMethod)}
              </p>
            </section>

            <section className={styles.section}>
              <SectionHeading compact title="Контактные данные" />

              <div className={styles.formGrid}>
                <Input
                  label="Имя"
                  requiredMark
                  defaultValue={user.firstName}
                  error={fieldErrors.firstName}
                  name="firstName"
                  autoComplete="given-name"
                  onChange={() => handleFieldChange('firstName')}
                />
                <Input
                  label="Фамилия"
                  requiredMark
                  defaultValue={user.lastName}
                  error={fieldErrors.lastName}
                  name="lastName"
                  autoComplete="family-name"
                  onChange={() => handleFieldChange('lastName')}
                />
                <Input
                  label="Email"
                  requiredMark
                  defaultValue={user.email}
                  error={fieldErrors.email}
                  name="email"
                  autoComplete="email"
                  onChange={() => handleFieldChange('email')}
                />
                <Input
                  label="Телефон"
                  requiredMark
                  defaultValue={formatPhoneNumber(user.phone ?? '')}
                  error={fieldErrors.phone}
                  inputMode="tel"
                  maxLength={16}
                  name="phone"
                  autoComplete="tel"
                  onChange={handlePhoneChange}
                  placeholder="+7 999 123-45-67"
                  required
                  type="tel"
                />
              </div>

              <label className={styles.commentField}>
                <span className={styles.commentLabel}>
                  Комментарий к заказу
                </span>
                <textarea
                  className={styles.commentInput}
                  name="comment"
                  rows={4}
                />
              </label>
            </section>

            <div className={styles.switchRow}>
              <Switch label="Получать уведомления на email" defaultChecked />
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
        </div>

        <Card className={styles.summaryCard}>
          <SectionHeading compact title="Ваш заказ" />
          <span className={styles.summaryCount}>
            {summary.totalItems} товара
          </span>

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
                    <img
                      className={styles.summaryImage}
                      src={item.image || '/product-placeholder.svg'}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.src = '/product-placeholder.svg'
                      }}
                    />
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryName}>{item.name}</span>
                      <span className={styles.summaryMeta}>
                        {item.quantity} x{' '}
                        {priceFormatter.format(item.unitPrice)} ₽
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <dl className={styles.totals}>
                <div className={styles.totalRow}>
                  <dt className={styles.totalTerm}>Сумма заказа</dt>
                  <dd className={styles.totalValue}>
                    {priceFormatter.format(summary.totalPrice)} ₽
                  </dd>
                </div>
                <div className={styles.totalRow}>
                  <dt className={styles.totalTerm}>Стоимость доставки</dt>
                  <dd className={styles.totalValue}>бесплатно</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt className={styles.totalTerm}>Итого</dt>
                  <dd className={styles.totalValue}>
                    {priceFormatter.format(summary.totalPrice)} ₽
                  </dd>
                </div>
              </dl>
              <Button
                className={styles.summarySubmit}
                type="submit"
                form="checkout-form"
                fullWidth
                disabled={checkoutDisabled}
              >
                Оплатить
              </Button>
            </div>
          )}

          {hasUnavailableItems ? (
            <p className={styles.serverError} role="alert">
              В заказе есть недоступные товары. Удалите их из корзины.
            </p>
          ) : null}
        </Card>
      </div>
    </section>
  )
}
