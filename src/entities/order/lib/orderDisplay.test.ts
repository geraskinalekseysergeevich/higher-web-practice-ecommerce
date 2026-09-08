import {
  formatOrderDate,
  getDeliveryMethodLabel,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from './orderDisplay'

describe('order display helpers', () => {
  it('returns labels for order status, payment and delivery methods', () => {
    expect(getOrderStatusLabel('delivered')).toBe('Получен')
    expect(getPaymentMethodLabel('card_online')).toBe('Картой онлайн')
    expect(getDeliveryMethodLabel('pickup_point')).toBe('Пункт выдачи')
  })

  it('formats an order date for display', () => {
    expect(formatOrderDate('2026-03-01T10:00:00Z')).toContain('2026')
  })
})
