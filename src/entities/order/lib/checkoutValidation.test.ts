import {
  getDeliveryEstimate,
  validateCheckoutValues,
} from './checkoutValidation'

describe('validateCheckoutValues', () => {
  it('requires phone and courier address fields for courier delivery', () => {
    expect(
      validateCheckoutValues({
        phone: '',
        deliveryMethod: 'courier',
        country: '',
        city: '',
        street: '',
        house: '',
      })
    ).toEqual({
      phone: 'Укажите телефон',
      country: 'Укажите страну',
      city: 'Укажите город',
      street: 'Укажите улицу',
      house: 'Укажите номер дома',
    })
  })

  it('requires a pickup point for pickup delivery', () => {
    expect(
      validateCheckoutValues({
        phone: '+79991234567',
        deliveryMethod: 'pickup',
        pickupPointId: '',
      })
    ).toEqual({ pickupPointId: 'Выберите пункт выдачи' })
  })

  it('accepts valid courier and pickup values', () => {
    expect(
      validateCheckoutValues({
        phone: '+79991234567',
        deliveryMethod: 'courier',
        country: 'Россия',
        city: 'Москва',
        street: 'Тверская',
        house: '7',
      })
    ).toEqual({})

    expect(
      validateCheckoutValues({
        phone: '+79991234567',
        deliveryMethod: 'pickup',
        pickupPointId: 'point-1',
      })
    ).toEqual({})
  })

  it('uses deterministic delivery estimates without an external service', () => {
    expect(getDeliveryEstimate('courier')).toBe('2–3 рабочих дня')
    expect(getDeliveryEstimate('pickup')).toBe('1–2 рабочих дня')
  })
})
