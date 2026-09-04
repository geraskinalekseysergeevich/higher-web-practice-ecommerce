import type { User } from '../../../types'
import type { CartLineItem } from '../../cart/lib/getCartLineItems'
import { buildOrderFromCheckout } from './buildOrderFromCheckout'

const user: User = {
  id: 'user-1',
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'ivan@example.com',
  createdAt: '2026-03-01T10:00:00Z',
}

const lineItems: CartLineItem[] = [
  {
    id: 'cart-1',
    productId: 'product-1',
    name: 'Председатель',
    image: '/mustaches/chairman/0.png',
    inStock: true,
    unitPrice: 5590,
    quantity: 1,
    totalPrice: 5590,
  },
]

describe('buildOrderFromCheckout', () => {
  it('marks the simulated online payment as paid', () => {
    const order = buildOrderFromCheckout({
      user,
      lineItems,
      phone: '+79991234567',
      paymentMethod: 'card_online',
      deliveryMethod: 'courier',
      deliveryAddress: {
        country: 'Россия',
        city: 'Москва',
        street: 'Тверская',
        house: '7',
      },
    })

    expect(order.status).toBe('paid')
    expect(order.totalPrice).toBe(5590)
  })

  it('persists normalized contact details from checkout', () => {
    const order = buildOrderFromCheckout({
      user,
      lineItems,
      customer: {
        firstName: '  Анна ',
        lastName: ' Смирнова ',
        email: ' ANNA@example.com ',
      },
      phone: ' +79991234567 ',
      comment: '  Позвонить  ',
      paymentMethod: 'cash',
      deliveryMethod: 'pickup',
      pickupPointId: 'point-1',
    })

    expect(order.customer).toEqual({
      firstName: 'Анна',
      lastName: 'Смирнова',
      email: 'anna@example.com',
      phone: '+79991234567',
    })
    expect(order.comment).toBe('Позвонить')
  })
})
