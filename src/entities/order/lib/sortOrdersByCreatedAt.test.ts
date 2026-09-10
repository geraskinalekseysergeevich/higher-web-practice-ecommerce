import { sortOrdersByCreatedAt } from './sortOrdersByCreatedAt'

describe('sortOrdersByCreatedAt', () => {
  it('puts the newest orders first without changing the source array', () => {
    const orders = [
      { id: 'old', createdAt: '2026-08-26T10:00:00Z' },
      { id: 'new', createdAt: '2026-09-08T10:00:00Z' },
      { id: 'middle', createdAt: '2026-08-30T10:00:00Z' },
    ]

    const sortedOrders = sortOrdersByCreatedAt(orders)

    expect(sortedOrders.map((order) => order.id)).toEqual([
      'new',
      'middle',
      'old',
    ])
    expect(orders.map((order) => order.id)).toEqual(['old', 'new', 'middle'])
  })
})
