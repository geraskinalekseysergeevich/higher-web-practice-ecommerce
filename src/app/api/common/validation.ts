import type {
  CartItem,
  Order,
  OrderItem,
  PickupPoint,
  Product,
  ProductRating,
  StoredUser,
  User,
} from '../../../types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const requiredString = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid API response: ${field}`)
  }

  return value
}

const requiredIdentifier = (value: unknown, field: string) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return String(value)
  }

  throw new Error(`Invalid API response: ${field}`)
}

const requiredNumber = (value: unknown, field: string) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid API response: ${field}`)
  }

  return value
}

const requiredBoolean = (value: unknown, field: string) => {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid API response: ${field}`)
  }

  return value
}

const boundedNumber = (
  value: unknown,
  field: string,
  min: number,
  max: number
) => {
  const number = requiredNumber(value, field)

  if (number < min || number > max) {
    throw new Error(`Invalid API response: ${field}`)
  }

  return number
}

const oneOf = <T extends string>(
  value: unknown,
  values: readonly T[],
  field: string
) => {
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new Error(`Invalid API response: ${field}`)
  }

  return value as T
}

const parseProduct = (value: unknown): Product => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: product')
  }

  const images = value.images
  const characteristics = value.characteristics

  if (
    !Array.isArray(images) ||
    !images.every((image) => typeof image === 'string') ||
    !isRecord(characteristics) ||
    !Object.values(characteristics).every((item) => typeof item === 'string')
  ) {
    throw new Error('Invalid API response: product fields')
  }

  return {
    id: requiredString(value.id, 'product.id'),
    name: requiredString(value.name, 'product.name'),
    description: requiredString(value.description, 'product.description'),
    price: requiredNumber(value.price, 'product.price'),
    images,
    characteristics: characteristics as Record<string, string>,
    inStock: requiredBoolean(value.inStock, 'product.inStock'),
    rating: boundedNumber(value.rating, 'product.rating', 0, 5),
    ratingCount: boundedNumber(
      value.ratingCount,
      'product.ratingCount',
      0,
      Number.MAX_SAFE_INTEGER
    ),
    createdAt: requiredString(value.createdAt, 'product.createdAt'),
  }
}

const parseUser = (value: unknown): StoredUser => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: user')
  }

  return {
    id: requiredString(value.id, 'user.id'),
    firstName: requiredString(value.firstName, 'user.firstName'),
    lastName: requiredString(value.lastName, 'user.lastName'),
    email: requiredString(value.email, 'user.email'),
    password: requiredString(value.password, 'user.password'),
    phone: typeof value.phone === 'string' ? value.phone : undefined,
    language:
      typeof value.language === 'string'
        ? oneOf(
            value.language,
            ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja'] as const,
            'user.language'
          )
        : undefined,
    notifyByEmail:
      typeof value.notifyByEmail === 'boolean'
        ? value.notifyByEmail
        : undefined,
    createdAt: requiredString(value.createdAt, 'user.createdAt'),
  }
}

const parseCartItem = (value: unknown): CartItem => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: cart item')
  }

  const quantity = requiredNumber(value.quantity, 'cart.quantity')

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Invalid API response: cart.quantity')
  }

  return {
    id: requiredIdentifier(value.id, 'cart.id'),
    userId: requiredString(value.userId, 'cart.userId'),
    productId: requiredString(value.productId, 'cart.productId'),
    quantity,
  }
}

const parseOrderItem = (value: unknown): OrderItem => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: order item')
  }

  return {
    productId: requiredString(value.productId, 'order.item.productId'),
    name: requiredString(value.name, 'order.item.name'),
    image:
      typeof value.image === 'string'
        ? value.image
        : '/product-placeholder.svg',
    price: requiredNumber(value.price, 'order.item.price'),
    quantity: boundedNumber(
      value.quantity,
      'order.item.quantity',
      1,
      Number.MAX_SAFE_INTEGER
    ),
  }
}

const parseOrder = (value: unknown): Order => {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('Invalid API response: order')
  }

  const customer = value.customer

  if (!isRecord(customer)) {
    throw new Error('Invalid API response: order.customer')
  }

  return {
    id: requiredString(value.id, 'order.id'),
    number: requiredString(value.number, 'order.number'),
    userId: requiredString(value.userId, 'order.userId'),
    status: oneOf(
      value.status,
      [
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ] as const,
      'order.status'
    ),
    items: value.items.map(parseOrderItem),
    totalPrice: requiredNumber(value.totalPrice, 'order.totalPrice'),
    paymentMethod: oneOf(
      value.paymentMethod,
      ['card_online', 'card_on_delivery', 'cash'] as const,
      'order.paymentMethod'
    ),
    deliveryMethod: oneOf(
      value.deliveryMethod,
      ['courier', 'pickup_point'] as const,
      'order.deliveryMethod'
    ),
    deliveryAddress: isRecord(value.deliveryAddress)
      ? {
          country: requiredString(
            value.deliveryAddress.country,
            'order.address.country'
          ),
          city: requiredString(
            value.deliveryAddress.city,
            'order.address.city'
          ),
          street: requiredString(
            value.deliveryAddress.street,
            'order.address.street'
          ),
          house: requiredString(
            value.deliveryAddress.house,
            'order.address.house'
          ),
          apartment:
            typeof value.deliveryAddress.apartment === 'string'
              ? value.deliveryAddress.apartment
              : undefined,
          postalCode:
            typeof value.deliveryAddress.postalCode === 'string'
              ? value.deliveryAddress.postalCode
              : undefined,
        }
      : undefined,
    pickupPointId:
      typeof value.pickupPointId === 'string' ? value.pickupPointId : undefined,
    customer: {
      firstName: requiredString(customer.firstName, 'order.customer.firstName'),
      lastName: requiredString(customer.lastName, 'order.customer.lastName'),
      email: requiredString(customer.email, 'order.customer.email'),
      phone: requiredString(customer.phone, 'order.customer.phone'),
    },
    comment: typeof value.comment === 'string' ? value.comment : undefined,
    createdAt: requiredString(value.createdAt, 'order.createdAt'),
  }
}

const parseRating = (value: unknown): ProductRating => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: rating')
  }

  const productId = requiredString(value.productId, 'rating.productId')
  const userId = requiredString(value.userId, 'rating.userId')

  return {
    id: typeof value.id === 'string' ? value.id : `${productId}-${userId}`,
    productId,
    userId,
    userName: requiredString(value.userName, 'rating.userName'),
    rating: boundedNumber(value.rating, 'rating.rating', 1, 5),
    createdAt: requiredString(value.createdAt, 'rating.createdAt'),
  }
}

const parsePickupPoint = (value: unknown): PickupPoint => {
  if (!isRecord(value)) {
    throw new Error('Invalid API response: pickup point')
  }

  return {
    id: requiredString(value.id, 'pickupPoint.id'),
    name: requiredString(value.name, 'pickupPoint.name'),
    address: requiredString(value.address, 'pickupPoint.address'),
  }
}

const parseArray = <T>(
  value: unknown,
  parser: (item: unknown) => T,
  resource: string
) => {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid API response: ${resource} list`)
  }

  return value.map(parser)
}

export const parseProducts = (value: unknown) =>
  parseArray(value, parseProduct, 'products')
export const parseProductResponse = (value: unknown) => parseProduct(value)
export const parseUsers = (value: unknown) =>
  parseArray(value, parseUser, 'users')
export const parseUserEmails = (
  value: unknown
): Array<Pick<User, 'id' | 'email'>> =>
  parseArray(
    value,
    (item) => {
      if (!isRecord(item)) {
        throw new Error('Invalid API response: user email')
      }

      return {
        id: requiredString(item.id, 'user.id'),
        email: requiredString(item.email, 'user.email'),
      }
    },
    'users'
  )
export const parseUserResponse = (value: unknown) => parseUser(value)
export const parseCart = (value: unknown) =>
  parseArray(value, parseCartItem, 'cart')
export const parseCartResponse = (value: unknown) => parseCartItem(value)
export const parseOrders = (value: unknown) =>
  parseArray(value, parseOrder, 'orders')
export const parseOrderResponse = (value: unknown) => parseOrder(value)
export const parseRatings = (value: unknown) =>
  parseArray(value, parseRating, 'ratings')
export const parseRatingResponse = (value: unknown) => parseRating(value)
export const parsePickupPoints = (value: unknown) =>
  parseArray(value, parsePickupPoint, 'pickupPoints')
export const parsePickupPointResponse = (value: unknown) =>
  parsePickupPoint(value)
