import type {
  Address,
  DeliveryMethod,
  Order,
  PaymentMethod,
  User,
} from '../../../types'
import type { CartLineItem } from '../../cart/lib/getCartLineItems'

export type BuildOrderFromCheckoutArgs = {
  user: User
  lineItems: CartLineItem[]
  phone: string
  comment?: string
  paymentMethod: PaymentMethod
  deliveryMethod: 'courier' | 'pickup'
  deliveryAddress?: Address
  pickupPointId?: string
}

export const buildOrderFromCheckout = ({
  comment,
  deliveryAddress,
  deliveryMethod,
  lineItems,
  paymentMethod,
  phone,
  pickupPointId,
  user,
}: BuildOrderFromCheckoutArgs): Order => {
  const createdAt = new Date().toISOString()
  const orderId = `order-${Date.now()}`
  const orderNumber = `ORDER-${Date.now()}`
  const normalizedDeliveryMethod: DeliveryMethod =
    deliveryMethod === 'pickup' ? 'pickup_point' : 'courier'

  const items = lineItems.map(({ image, name, productId, quantity, unitPrice }) => ({
    image,
    name,
    price: unitPrice,
    productId,
    quantity,
  }))

  return {
    id: orderId,
    number: orderNumber,
    userId: user.id,
    status: 'pending',
    items,
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    paymentMethod,
    deliveryMethod: normalizedDeliveryMethod,
    deliveryAddress: deliveryMethod === 'courier' ? deliveryAddress : undefined,
    pickupPointId: deliveryMethod === 'pickup' ? pickupPointId : undefined,
    customer: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone,
    },
    comment,
    createdAt,
  }
}
