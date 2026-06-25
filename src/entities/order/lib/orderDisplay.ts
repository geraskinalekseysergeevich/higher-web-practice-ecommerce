import type { DeliveryMethod, OrderStatus, PaymentMethod } from '../../../types'

const orderDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  card_online: 'Картой онлайн',
  card_on_delivery: 'Картой при получении',
  cash: 'Наличными',
}

const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  courier: 'Курьерская служба',
  pickup_point: 'Пункт выдачи',
}

export const getOrderStatusLabel = (status: OrderStatus) =>
  orderStatusLabels[status]

export const getPaymentMethodLabel = (paymentMethod: PaymentMethod) =>
  paymentMethodLabels[paymentMethod]

export const getDeliveryMethodLabel = (deliveryMethod: DeliveryMethod) =>
  deliveryMethodLabels[deliveryMethod]

export const formatOrderDate = (date: string) =>
  orderDateFormatter.format(new Date(date))
