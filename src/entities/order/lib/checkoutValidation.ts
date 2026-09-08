export type CheckoutValidationValues = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  deliveryMethod: 'courier' | 'pickup'
  country?: string
  city?: string
  street?: string
  house?: string
  pickupPointId?: string
}

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutValidationValues, string>
>

export const clearCheckoutFieldError = (
  errors: CheckoutFieldErrors,
  field: keyof CheckoutFieldErrors
): CheckoutFieldErrors => {
  if (!(field in errors)) {
    return errors
  }

  const nextErrors = { ...errors }
  delete nextErrors[field]
  return nextErrors
}

const hasValue = (value?: string) => Boolean(value?.trim())

export const validateCheckoutValues = (
  values: CheckoutValidationValues
): CheckoutFieldErrors => {
  const errors: CheckoutFieldErrors = {}
  const phoneDigits = values.phone?.replace(/\D/g, '') ?? ''

  if ('firstName' in values && !hasValue(values.firstName)) {
    errors.firstName = 'Укажите имя'
  }

  if ('lastName' in values && !hasValue(values.lastName)) {
    errors.lastName = 'Укажите фамилию'
  }

  if ('email' in values && !hasValue(values.email)) {
    errors.email = 'Укажите email'
  }

  if (phoneDigits.length < 10) {
    errors.phone = 'Укажите телефон'
  }

  if (values.deliveryMethod === 'pickup') {
    if (!hasValue(values.pickupPointId)) {
      errors.pickupPointId = 'Выберите пункт выдачи'
    }

    return errors
  }

  if (!hasValue(values.country)) {
    errors.country = 'Укажите страну'
  }

  if (!hasValue(values.city)) {
    errors.city = 'Укажите город'
  }

  if (!hasValue(values.street)) {
    errors.street = 'Укажите улицу'
  }

  if (!hasValue(values.house)) {
    errors.house = 'Укажите номер дома'
  }

  return errors
}

export const getDeliveryEstimate = (deliveryMethod: 'courier' | 'pickup') =>
  deliveryMethod === 'courier' ? '2–3 рабочих дня' : '1–2 рабочих дня'
